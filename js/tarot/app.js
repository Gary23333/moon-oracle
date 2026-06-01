// 月影决策屋 - 塔罗占卜主逻辑

const TarotApp = {
    state: {
        currentView: 'welcome',
        category: null,
        question: '',
        spreadType: null,
        maxCards: 1,
        selectedCards: [],
        drawnDeck: [],
        readingResult: '',
        revealedCards: [],
        conversationHistory: [],
        details: '',
        followupLoading: false,
        readingSystemPrompt: ''  // 1.2: 保存占卜系统提示词用于追问上下文
    },

    _safeGetElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`[TarotApp] 元素 #${id} 未找到`);
        return el;
    },

    init() {
        MoonConfig.init();
        MoonEffects.init();
        MoonEffects.createStars('starsContainer');
        this.bindEvents();
        this.showView('welcome');
    },

    bindEvents() {
        // 分类选择
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectCategory(btn.dataset.category));
            // 2.1: ARIA 状态
            btn.setAttribute('aria-pressed', 'false');
        });

        // 提问
        const askBtn = this._safeGetElement('askBtn');
        const userQuestion = this._safeGetElement('userQuestion');
        if (askBtn) askBtn.addEventListener('click', () => this.askQuestion());
        if (userQuestion) userQuestion.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.askQuestion(); }
        });

        // 牌阵选择 — 2.1: 键盘导航
        document.querySelectorAll('.spread-card').forEach(card => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${card.querySelector('.spread-name')?.textContent} - ${card.querySelector('.spread-desc')?.textContent}`);
            card.addEventListener('click', () => this.selectSpread(card.dataset.spread));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectSpread(card.dataset.spread); }
            });
        });

        // 选牌 — null 安全
        const confirmCards = this._safeGetElement('confirmCards');
        const backToSpread = this._safeGetElement('backToSpread');
        if (confirmCards) confirmCards.addEventListener('click', () => this.confirmCards());
        if (backToSpread) backToSpread.addEventListener('click', () => this.showView('spread'));

        // 细节追问
        const submitDetails = this._safeGetElement('submitDetails');
        if (submitDetails) submitDetails.addEventListener('click', () => this.submitDetails());

        // 2.4: 细节页返回按钮
        const backToSelect = this._safeGetElement('backToSelect');
        if (backToSelect) backToSelect.addEventListener('click', () => this.showView('select'));

        // 结果页追问
        const followupBtn = this._safeGetElement('followupBtn');
        const followupInput = this._safeGetElement('followupInput');
        if (followupBtn) followupBtn.addEventListener('click', () => this.sendFollowup());
        if (followupInput) followupInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this.sendFollowup(); }
        });

        // 重新开始 — 2.5: 二次确认
        const restartBtn = this._safeGetElement('restartBtn');
        if (restartBtn) restartBtn.addEventListener('click', () => this.restart());
    },

    // 2.2: 视图切换焦点管理
    showView(viewName) {
        // 取消进行中的打字动画
        if (MoonUtils._activeTyping) {
            MoonUtils._activeTyping.cancel();
        }

        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (target) {
            target.classList.add('active');
            this.state.currentView = viewName;
            target.scrollTop = 0;
            // 2.2: 焦点移到新视图标题
            const heading = target.querySelector('h1, h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus({ preventScroll: true });
            }
        }
    },

    selectCategory(categoryId) {
        this.state.category = categoryId;
        const cat = getCategoryById(categoryId);

        // 高亮选中 + 2.1: ARIA
        document.querySelectorAll('.category-btn').forEach(btn => {
            const selected = btn.dataset.category === categoryId;
            btn.classList.toggle('selected', selected);
            btn.setAttribute('aria-pressed', String(selected));
        });

        // 填充输入框
        const input = this._safeGetElement('userQuestion');
        if (input) {
            if (cat.placeholder) input.placeholder = cat.placeholder;
            input.focus();
        }
    },

    async askQuestion() {
        const input = this._safeGetElement('userQuestion');
        if (!input) return;
        const question = input.value.trim();

        if (!question) {
            MoonUtils.showToast('请先输入你的问题');
            return;
        }
        if (!this.state.category) {
            MoonUtils.showToast('请先选择问题分类');
            return;
        }
        if (!MoonConfig.get('apiKey')) {
            MoonUtils.showToast('请先在配置中填写 API Key');
            return;
        }

        this.state.question = question;
        this.state.conversationHistory = [];

        // 推荐牌阵
        const cat = getCategoryById(this.state.category);
        const recommend = CATEGORY_SPREAD_RECOMMEND[this.state.category];

        // 更新牌阵选择页的推荐
        if (recommend.recommend) {
            document.querySelectorAll('.spread-card').forEach(card => {
                const isRecommended = card.dataset.spread === recommend.recommend;
                card.classList.toggle('recommended', isRecommended);
                const badge = card.querySelector('.recommend-badge');
                if (badge) badge.style.display = isRecommended ? 'block' : 'none';
            });
            const recommendEl = this._safeGetElement('spreadRecommend');
            if (recommendEl) recommendEl.textContent = `月影建议：${recommend.reason}`;
        }

        this.showView('spread');
    },

    selectSpread(spreadType) {
        const spread = getSpreadInfo(spreadType);
        this.state.spreadType = spreadType;
        this.state.maxCards = spread.cardCount;
        this.state.selectedCards = [];
        this.state.drawnDeck = this.shuffleDeck();

        // 更新UI — null 安全
        const selectDesc = this._safeGetElement('selectDesc');
        const selectedCount = this._safeGetElement('selectedCount');
        const confirmCards = this._safeGetElement('confirmCards');
        if (selectDesc) selectDesc.textContent = `请选择${spread.cardCount}张牌`;
        if (selectedCount) selectedCount.textContent = `已选择: 0 / ${spread.cardCount}`;
        if (confirmCards) confirmCards.disabled = true;

        // 初始化选牌网格
        this.initCardGrid();
        this.showView('select');
    },

    shuffleDeck() {
        const deck = getFullDeck();
        const shuffled = MoonUtils.shuffleArray(deck);
        return shuffled.map((card, index) => ({
            ...card,
            position: index + 1,
            orientation: MoonUtils.getRandomOrientation()
        }));
    },

    initCardGrid() {
        const grid = this._safeGetElement('cardsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        this.state.drawnDeck.forEach((card, index) => {
            const el = document.createElement('div');
            el.className = 'tarot-card';
            el.dataset.position = card.position;
            // 2.1: ARIA + 键盘
            el.setAttribute('role', 'checkbox');
            el.setAttribute('aria-checked', 'false');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', `第${card.position}张牌`);
            el.innerHTML = `
                <div class="tarot-card-inner">
                    <div class="tarot-card-back">
                        <div class="card-back-pattern"></div>
                        <span class="tarot-card-back-symbol">✦</span>
                        <span class="card-number">${card.position}</span>
                    </div>
                </div>
            `;
            el.addEventListener('click', () => this.toggleCardSelection(card.position));
            el.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCardSelection(card.position);
                }
            });
            el.style.animationDelay = `${index * 0.03}s`;
            grid.appendChild(el);
        });
    },

    toggleCardSelection(position) {
        const index = this.state.selectedCards.indexOf(position);

        if (index === -1) {
            if (this.state.selectedCards.length < this.state.maxCards) {
                this.state.selectedCards.push(position);
                MoonEffects.createFlash('rgba(139,92,246,0.15)');
            }
        } else {
            this.state.selectedCards.splice(index, 1);
        }

        this.updateCardSelectionUI();
    },

    updateCardSelectionUI() {
        const cards = document.querySelectorAll('.tarot-card');
        cards.forEach(card => {
            const pos = parseInt(card.dataset.position);
            const selected = this.state.selectedCards.includes(pos);
            card.classList.toggle('selected', selected);
            card.setAttribute('aria-checked', String(selected));
        });

        const selectedCount = this._safeGetElement('selectedCount');
        const confirmCards = this._safeGetElement('confirmCards');
        if (selectedCount) selectedCount.textContent =
            `已选择: ${this.state.selectedCards.length} / ${this.state.maxCards}`;
        if (confirmCards) confirmCards.disabled =
            this.state.selectedCards.length !== this.state.maxCards;
    },

    async confirmCards() {
        if (this.state.selectedCards.length !== this.state.maxCards) return;

        // 获取选中的牌
        this.state.revealedCards = this.state.selectedCards.map(pos => {
            return this.state.drawnDeck.find(c => c.position === pos);
        });

        // 检查是否需要追问细节
        const cat = getCategoryById(this.state.category);
        if (cat.subQuestions && cat.subQuestions.length > 0 && this.state.category !== 'daily') {
            this.showDetailQuestions();
        } else {
            await this.performReading();
        }
    },

    showDetailQuestions() {
        const cat = getCategoryById(this.state.category);
        const container = this._safeGetElement('detailQuestions');
        if (!container) return;

        let html = `<p class="detail-intro">在翻开命运之牌前，告诉我更多细节...</p>`;
        cat.subQuestions.forEach((q, i) => {
            html += `<div class="detail-question">
                <label>${q}</label>
                <input type="text" class="detail-input" data-index="${i}" placeholder="你的回答...">
            </div>`;
        });
        html += `<div class="detail-question">
            <label>补充说明（可选）：</label>
            <textarea class="detail-input" id="detailExtra" rows="3" placeholder="任何你想告诉月影的..."></textarea>
        </div>`;

        container.innerHTML = html;
        this.showView('detail');
    },

    async submitDetails() {
        const inputs = document.querySelectorAll('.detail-input');
        const details = [];
        inputs.forEach(input => {
            const val = input.value.trim();
            if (val) details.push(val);
        });
        this.state.details = details.join('；');

        await this.performReading();
    },

    async performReading() {
        MoonUtils.showLoading('月影正在与命运对话...');

        try {
            const spread = getSpreadInfo(this.state.spreadType);
            const context = {
                question: this.state.question,
                category: getCategoryById(this.state.category).name,
                spreadType: this.state.spreadType,
                spreadName: spread.name,
                details: this.state.details,
                cards: this.state.revealedCards.map((card, i) => ({
                    position: spread.positions[i],
                    name: card.name,
                    orientation: card.orientation,
                    keywords: card.orientation === '正位' ? card.uprightKeywords : card.reversedKeywords
                }))
            };

            const systemPrompt = TAROT_PROMPTS.getReading(context);
            // 1.2: 保存系统提示词用于追问上下文
            this.state.readingSystemPrompt = systemPrompt;
            const userMessage = `请为我解读这次塔罗占卜。我的问题是：${this.state.question}`;

            const result = await MoonAPI.chatSingle(systemPrompt, userMessage, { thinking: true });

            this.state.readingResult = result.content;
            this.state.conversationHistory = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
                { role: 'assistant', content: result.content, thinking: result.thinking }
            ];

            MoonUtils.hideLoading();
            this.showResult(result);
        } catch (error) {
            MoonUtils.hideLoading();
            MoonUtils.showToast('占卜失败: ' + error.message);
            console.error('Reading error:', error);
        }
    },

    showResult(result) {
        // 渲染牌面
        this.renderResultCards();

        // 显示解读文本
        const resultText = this._safeGetElement('resultText');
        if (resultText) {
            if (MoonConfig.get('showThinking') && result.thinking) {
                resultText.innerHTML = `<div class="thinking-box"><strong>月影的思考过程：</strong><br>${MoonUtils.formatText(result.thinking)}</div><hr>${MoonUtils.formatText(result.content)}`;
            } else {
                resultText.innerHTML = MoonUtils.formatText(result.content);
            }
        }

        // 清空追问历史
        const followupHistory = this._safeGetElement('followupHistory');
        if (followupHistory) followupHistory.innerHTML = '';

        this.showView('result');
    },

    renderResultCards() {
        const container = this._safeGetElement('resultCards');
        if (!container) return;
        container.innerHTML = '';

        // 1.5: 循环外调用
        const spread = getSpreadInfo(this.state.spreadType);

        this.state.revealedCards.forEach((card, index) => {
            const position = spread.positions[index] || '';
            const imageUrl = MoonUtils.getTarotImageUrl(card.id, TAROT_IMAGE_FILES);
            const isReversed = card.orientation === '逆位';

            const cardEl = document.createElement('div');
            cardEl.className = 'result-card';
            cardEl.style.animationDelay = `${index * 0.2}s`;
            cardEl.innerHTML = `
                <div class="result-card-inner">
                    <div class="result-card-back">
                        <div class="card-back-pattern"></div>
                        <span class="tarot-card-back-symbol">✦</span>
                    </div>
                    <div class="result-card-front">
                        <div class="result-card-frame">
                            <div class="result-card-image-wrap">
                                <img class="result-card-image ${isReversed ? 'reversed' : ''}"
                                     src="${imageUrl}" alt="${card.name} ${card.orientation}"
                                     loading="lazy">
                                <span class="result-card-fallback" style="display:none;font-size:1.5rem;color:var(--color-gold);text-align:center;padding:0.5rem;">${card.name}</span>
                            </div>
                            <div class="result-card-meta">
                                <span class="card-position">${position}</span>
                                <span class="card-name">${card.name}</span>
                                <span class="card-orientation ${isReversed ? 'reversed' : ''}">${card.orientation}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(cardEl);

            // 1.3: 用 addEventListener 替代 inline onerror
            const img = cardEl.querySelector('.result-card-image');
            const fallback = cardEl.querySelector('.result-card-fallback');
            if (img) {
                img.addEventListener('error', () => {
                    img.style.display = 'none';
                    if (fallback) fallback.style.display = 'block';
                });
            }

            // 延迟翻牌动画
            setTimeout(() => cardEl.classList.add('revealed'), 800 + index * 400);
        });
    },

    async sendFollowup() {
        const input = this._safeGetElement('followupInput');
        if (!input) return;
        const question = input.value.trim();
        if (!question || this.state.followupLoading) return;

        // 显示用户消息
        this.addFollowupMessage('user', question);
        input.value = '';

        this.state.followupLoading = true;
        const btn = this._safeGetElement('followupBtn');
        if (btn) { btn.disabled = true; btn.textContent = '思考中...'; }

        try {
            // 1.2: 用完整的阅读系统提示词保持上下文，而非丢失牌义的简化版
            const messages = [
                { role: 'system', content: this.state.readingSystemPrompt || TAROT_PROMPTS.getFollowup({
                    question: this.state.question,
                    previousReading: this.state.readingResult,
                    spreadType: getSpreadInfo(this.state.spreadType).name
                })},
                ...this.state.conversationHistory.filter(m => m.role !== 'system'),
                { role: 'user', content: question }
            ];

            const result = await MoonAPI.chat(messages);
            this.state.conversationHistory.push({ role: 'user', content: question });
            this.state.conversationHistory.push({ role: 'assistant', content: result.content, thinking: result.thinking });

            // 2.6: 追问也显示思考过程
            this.addFollowupMessage('assistant', result.content, result.thinking);
        } catch (error) {
            this.addFollowupMessage('assistant', '抱歉，暂时无法回答。请稍后再试。');
            console.error('Followup error:', error);
        } finally {
            this.state.followupLoading = false;
            if (btn) { btn.disabled = false; btn.textContent = '追问'; }
        }
    },

    // 2.6: 支持 thinking 参数
    addFollowupMessage(role, content, thinking = null) {
        const history = this._safeGetElement('followupHistory');
        if (!history) return;
        const msg = document.createElement('div');
        msg.className = `followup-message ${role}`;
        let html = '';
        if (role === 'assistant' && MoonConfig.get('showThinking') && thinking) {
            html += `<div class="thinking-box" style="font-size:0.8rem;margin-bottom:0.5rem;"><strong>思考过程：</strong><br>${MoonUtils.formatText(thinking)}</div>`;
        }
        html += `<div class="followup-content">${MoonUtils.formatText(content)}</div>`;
        msg.innerHTML = html;
        history.appendChild(msg);
        history.scrollTop = history.scrollHeight;
    },

    // 2.5: 重启确认
    restart() {
        if (!confirm('确定要重新占卜吗？当前结果将丢失。')) return;

        this.state = {
            currentView: 'welcome', category: null, question: '',
            spreadType: null, maxCards: 1, selectedCards: [],
            drawnDeck: [], readingResult: '', revealedCards: [],
            conversationHistory: [], details: '', followupLoading: false,
            readingSystemPrompt: ''
        };
        const userQuestion = this._safeGetElement('userQuestion');
        if (userQuestion) userQuestion.value = '';
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
        this.showView('welcome');
    }
};

document.addEventListener('DOMContentLoaded', () => TarotApp.init());
