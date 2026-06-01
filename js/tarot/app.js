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
        followupLoading: false
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
        });

        // 提问
        document.getElementById('askBtn').addEventListener('click', () => this.askQuestion());
        document.getElementById('userQuestion').addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.askQuestion(); }
        });

        // 牌阵选择
        document.querySelectorAll('.spread-card').forEach(card => {
            card.addEventListener('click', () => this.selectSpread(card.dataset.spread));
        });

        // 选牌
        document.getElementById('confirmCards').addEventListener('click', () => this.confirmCards());
        document.getElementById('backToSpread').addEventListener('click', () => this.showView('spread'));

        // 细节追问
        document.getElementById('submitDetails').addEventListener('click', () => this.submitDetails());

        // 结果页追问
        document.getElementById('followupBtn').addEventListener('click', () => this.sendFollowup());
        document.getElementById('followupInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this.sendFollowup(); }
        });

        // 重新开始
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    },

    showView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (target) {
            target.classList.add('active');
            this.state.currentView = viewName;
            target.scrollTop = 0;
        }
    },

    selectCategory(categoryId) {
        this.state.category = categoryId;
        const cat = getCategoryById(categoryId);
        
        // 高亮选中
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.category === categoryId);
        });

        // 填充输入框
        const input = document.getElementById('userQuestion');
        if (cat.placeholder) input.placeholder = cat.placeholder;
        input.focus();
    },

    async askQuestion() {
        const input = document.getElementById('userQuestion');
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
            document.getElementById('spreadRecommend').textContent = `月影建议：${recommend.reason}`;
        }

        this.showView('spread');
    },

    selectSpread(spreadType) {
        const spread = getSpreadInfo(spreadType);
        this.state.spreadType = spreadType;
        this.state.maxCards = spread.cardCount;
        this.state.selectedCards = [];
        this.state.drawnDeck = this.shuffleDeck();

        // 更新UI
        document.getElementById('selectDesc').textContent = `请选择${spread.cardCount}张牌`;
        document.getElementById('selectedCount').textContent = `已选择: 0 / ${spread.cardCount}`;
        document.getElementById('confirmCards').disabled = true;

        // 初始化选牌网格
        this.initCardGrid();
        this.showView('select');
    },

    shuffleDeck() {
        const deck = getFullDeck();
        const shuffled = MoonUtils.shuffleArray(deck);
        // 为每张牌随机分配正逆位
        return shuffled.map((card, index) => ({
            ...card,
            position: index + 1,
            orientation: MoonUtils.getRandomOrientation()
        }));
    },

    initCardGrid() {
        const grid = document.getElementById('cardsGrid');
        grid.innerHTML = '';

        this.state.drawnDeck.forEach((card, index) => {
            const el = document.createElement('div');
            el.className = 'tarot-card';
            el.dataset.position = card.position;
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
            card.classList.toggle('selected', this.state.selectedCards.includes(pos));
        });

        document.getElementById('selectedCount').textContent = 
            `已选择: ${this.state.selectedCards.length} / ${this.state.maxCards}`;
        document.getElementById('confirmCards').disabled = 
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
        const container = document.getElementById('detailQuestions');
        
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
        const resultText = document.getElementById('resultText');
        if (MoonConfig.get('showThinking') && result.thinking) {
            resultText.innerHTML = `<div class="thinking-box"><strong>月影的思考过程：</strong><br>${MoonUtils.formatText(result.thinking)}</div><hr>${MoonUtils.formatText(result.content)}`;
        } else {
            resultText.innerHTML = MoonUtils.formatText(result.content);
        }
        
        // 清空追问历史
        document.getElementById('followupHistory').innerHTML = '';
        
        this.showView('result');
    },

    renderResultCards() {
        const container = document.getElementById('resultCards');
        container.innerHTML = '';

        this.state.revealedCards.forEach((card, index) => {
            const spread = getSpreadInfo(this.state.spreadType);
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
                                     src="${imageUrl}" alt="${card.name}${card.orientation}" 
                                     loading="lazy" onerror="this.style.display='none'">
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

            // 延迟翻牌动画
            setTimeout(() => cardEl.classList.add('revealed'), 800 + index * 400);
        });
    },

    async sendFollowup() {
        const input = document.getElementById('followupInput');
        const question = input.value.trim();
        if (!question || this.state.followupLoading) return;

        // 显示用户消息
        this.addFollowupMessage('user', question);
        input.value = '';
        
        this.state.followupLoading = true;
        const btn = document.getElementById('followupBtn');
        btn.disabled = true;
        btn.textContent = '思考中...';

        try {
            // 注入追问提示词
            const spread = getSpreadInfo(this.state.spreadType);
            const followupContext = {
                question: this.state.question,
                previousReading: this.state.readingResult,
                spreadType: spread.name
            };
            const followupPrompt = TAROT_PROMPTS.getFollowup(followupContext);
            
            // 构建带追问提示词的消息历史
            const messages = [
                { role: 'system', content: followupPrompt },
                ...this.state.conversationHistory.filter(m => m.role !== 'system'),
                { role: 'user', content: question }
            ];
            
            const result = await MoonAPI.chat(messages);
            this.state.conversationHistory.push({ role: 'user', content: question });
            this.state.conversationHistory.push({ role: 'assistant', content: result.content });
            
            this.addFollowupMessage('assistant', result.content);
        } catch (error) {
            this.addFollowupMessage('assistant', '抱歉，暂时无法回答。请稍后再试。');
            console.error('Followup error:', error);
        } finally {
            this.state.followupLoading = false;
            btn.disabled = false;
            btn.textContent = '追问';
        }
    },

    addFollowupMessage(role, content) {
        const history = document.getElementById('followupHistory');
        const msg = document.createElement('div');
        msg.className = `followup-message ${role}`;
        msg.innerHTML = `<div class="followup-content">${MoonUtils.formatText(content)}</div>`;
        history.appendChild(msg);
        history.scrollTop = history.scrollHeight;
    },

    restart() {
        this.state = {
            currentView: 'welcome', category: null, question: '',
            spreadType: null, maxCards: 1, selectedCards: [],
            drawnDeck: [], readingResult: '', revealedCards: [],
            conversationHistory: [], details: '', followupLoading: false
        };
        document.getElementById('userQuestion').value = '';
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
        this.showView('welcome');
    }
};

document.addEventListener('DOMContentLoaded', () => TarotApp.init());
