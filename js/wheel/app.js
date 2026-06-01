// 月影决策屋 - 转盘主逻辑

const WheelApp = {
    state: {
        currentView: 'home',
        wheel: null,
        currentPreset: null,
        customOptions: [],
        aiGenerating: false,
        // 双转盘状态
        isDualWheel: false,
        dualWheelLocation: null,
        dualWheelFirstResult: null
    },

    _safeGetElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`[WheelApp] 元素 #${id} 未找到`);
        return el;
    },

    init() {
        MoonConfig.init();
        MoonEffects.init();
        MoonEffects.createStars('starsContainer');
        this.bindEvents();
        this.showView('home');
    },

    bindEvents() {
        // 预设转盘
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectPreset(btn.dataset.preset));
        });

        // 分类筛选
        document.querySelectorAll('.cat-filter').forEach(btn => {
            btn.addEventListener('click', () => this.filterCategory(btn.dataset.cat));
        });

        // AI生成
        const aiGenerateBtn = this._safeGetElement('aiGenerateBtn');
        const aiInput = this._safeGetElement('aiInput');
        if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', () => this.aiGenerate());
        if (aiInput) aiInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this.aiGenerate(); }
        });

        // Feature 1: OCR
        const ocrBtn = this._safeGetElement('ocrBtn');
        const ocrFileInput = this._safeGetElement('ocrFileInput');
        if (ocrBtn) ocrBtn.addEventListener('click', () => this.ocrGenerate());
        if (ocrFileInput) ocrFileInput.addEventListener('change', e => this._handleOCRFile(e));

        // Feature 2: 附近美食
        const locationBtn = this._safeGetElement('locationBtn');
        if (locationBtn) locationBtn.addEventListener('click', () => this.locationGenerate());

        // Feature 3: 电影推荐
        const movieBtn = this._safeGetElement('movieBtn');
        if (movieBtn) movieBtn.addEventListener('click', () => this.movieGenerate());

        // 自定义转盘
        const customStartBtn = this._safeGetElement('customStartBtn');
        const customInput = this._safeGetElement('customInput');
        if (customStartBtn) customStartBtn.addEventListener('click', () => this.startCustom());
        if (customInput) customInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.startCustom(); }
        });

        // 转盘操作
        const spinBtn = this._safeGetElement('spinBtn');
        const respinBtn = this._safeGetElement('respinBtn');
        const newWheelBtn = this._safeGetElement('newWheelBtn');
        if (spinBtn) spinBtn.addEventListener('click', () => this.spin());
        if (respinBtn) respinBtn.addEventListener('click', () => this.respin());
        if (newWheelBtn) newWheelBtn.addEventListener('click', () => {
            this.state.isDualWheel = false;
            this.showView('home');
        });
    },

    showView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (target) {
            target.classList.add('active');
            this.state.currentView = viewName;
            const heading = target.querySelector('h1, h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus({ preventScroll: true });
            }
        }
    },

    filterCategory(cat) {
        document.querySelectorAll('.cat-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === cat);
        });
        document.querySelectorAll('.preset-btn').forEach(btn => {
            const preset = WHEEL_PRESETS[btn.dataset.preset];
            btn.style.display = (cat === 'all' || preset.category === cat) ? '' : 'none';
        });
    },

    selectPreset(presetId) {
        const preset = WHEEL_PRESETS[presetId];
        if (!preset) return;
        this.state.currentPreset = presetId;
        this.state.isDualWheel = false;
        this.startWheel(preset.name, preset.icon, preset.options, preset.weights);
    },

    startWheel(name, icon, options, weights = null) {
        const wheelTitle = this._safeGetElement('wheelTitle');
        if (wheelTitle) wheelTitle.textContent = `${icon} ${name}`;

        const canvas = this._safeGetElement('wheelCanvas');
        if (!canvas) return;
        this.state.wheel = new WheelRenderer(canvas, options, weights);
        this.state.wheel.onResult = (result) => this.showResult(result, name);

        const resultArea = this._safeGetElement('resultArea');
        const spinBtn = this._safeGetElement('spinBtn');
        const resultInterpret = this._safeGetElement('resultInterpret');
        if (resultArea) resultArea.style.display = 'none';
        if (resultInterpret) resultInterpret.style.display = 'none';
        if (spinBtn) { spinBtn.style.display = ''; spinBtn.disabled = false; }

        this.showView('wheel');
    },

    spin() {
        if (this.state.wheel && !this.state.wheel.isSpinning) {
            const spinBtn = this._safeGetElement('spinBtn');
            if (spinBtn) spinBtn.disabled = true;
            this.state.wheel.spin();
        }
    },

    respin() {
        const resultArea = this._safeGetElement('resultArea');
        const spinBtn = this._safeGetElement('spinBtn');
        const resultInterpret = this._safeGetElement('resultInterpret');
        if (resultArea) resultArea.style.display = 'none';
        if (resultInterpret) resultInterpret.style.display = 'none';
        if (spinBtn) { spinBtn.style.display = ''; spinBtn.disabled = false; }
        if (this.state.wheel) {
            this.state.wheel.rotation = 0;
            this.state.wheel.draw();
        }
    },

    showResult(result, wheelName) {
        const spinBtn = this._safeGetElement('spinBtn');
        const resultArea = this._safeGetElement('resultArea');
        const resultOption = this._safeGetElement('resultOption');
        const resultWheelName = this._safeGetElement('resultWheelName');

        if (spinBtn) spinBtn.style.display = 'none';
        if (resultArea) resultArea.style.display = '';
        if (resultOption) resultOption.textContent = result.option;
        if (resultWheelName) resultWheelName.textContent = wheelName;

        MoonEffects.createFlash('rgba(212,168,67,0.2)');

        // Feature 2: 双转盘 — 第一个转盘结果触发第二个
        if (this.state.isDualWheel && this.state.dualWheelLocation) {
            this._handleDualWheelResult(result.option);
            return;
        }

        // Feature 4: AI 结果解读
        if (MoonConfig.get('wheelResultAI')) {
            this._interpretResult(wheelName, result.option);
        }
    },

    // ========== Feature 1: OCR 截图识别 ==========

    ocrGenerate() {
        const fileInput = this._safeGetElement('ocrFileInput');
        if (fileInput) fileInput.click();
    },

    async _handleOCRFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 重置 input 以便同一文件可重复选择
        event.target.value = '';

        if (!MoonConfig.get('apiKey')) {
            MoonUtils.showToast('请先配置 API Key');
            return;
        }

        this.state.aiGenerating = true;
        MoonUtils.showLoading('正在加载 OCR 引擎...');

        try {
            const result = await WheelAIGenerator.fromOCR(file);
            MoonUtils.hideLoading();

            if (result.success) {
                this.startWheel(result.data.name, result.data.icon, result.data.options);
            } else {
                MoonUtils.showToast(result.error || 'OCR 识别失败');
            }
        } catch (error) {
            MoonUtils.hideLoading();
            MoonUtils.showToast(error.message || 'OCR 识别失败');
        } finally {
            this.state.aiGenerating = false;
        }
    },

    // ========== Feature 2: 附近美食双转盘 ==========

    async locationGenerate() {
        if (this.state.aiGenerating) return;

        this.state.aiGenerating = true;
        const btn = this._safeGetElement('locationBtn');
        if (btn) btn.disabled = true;

        try {
            if (!MoonConfig.get('apiKey')) {
                throw new Error('请先配置 API Key');
            }

            MoonUtils.showLoading('正在获取位置信息...');
            const result = await WheelAIGenerator.fromLocation();
            MoonUtils.hideLoading();

            if (result.success) {
                this.state.isDualWheel = result.isDual || false;
                this.state.dualWheelLocation = result.location || null;
                this.startWheel(result.data.name, result.data.icon, result.data.options);
            } else {
                MoonUtils.showToast(result.error || '获取美食推荐失败');
            }
        } catch (error) {
            MoonUtils.hideLoading();
            MoonUtils.showToast(error.message);
        } finally {
            this.state.aiGenerating = false;
            if (btn) btn.disabled = false;
        }
    },

    async _handleDualWheelResult(firstOption) {
        this.state.dualWheelFirstResult = firstOption;
        this.state.isDualWheel = false; // 第二个转盘不是双转盘

        MoonUtils.showLoading(`正在搜索附近的${firstOption}...`);

        try {
            const result = await WheelAIGenerator.fromLocationDetail(firstOption, this.state.dualWheelLocation);
            MoonUtils.hideLoading();

            if (result.success && result.data.options.length >= 2) {
                // 短暂延迟后启动第二个转盘
                setTimeout(() => {
                    this.startWheel(result.data.name, result.data.icon, result.data.options);
                }, 1000);
            } else {
                MoonUtils.showToast('未找到附近餐厅，换个菜系试试');
            }
        } catch (error) {
            MoonUtils.hideLoading();
            MoonUtils.showToast(error.message || '查询餐厅失败');
        }
    },

    // ========== Feature 3: 电影选择器 ==========

    async movieGenerate() {
        if (this.state.aiGenerating) return;

        this.state.aiGenerating = true;
        const btn = this._safeGetElement('movieBtn');
        if (btn) btn.disabled = true;

        try {
            if (!MoonConfig.get('apiKey')) {
                throw new Error('请先配置 API Key');
            }

            MoonUtils.showLoading('正在生成电影推荐...');
            const result = await WheelAIGenerator.getMovies();
            MoonUtils.hideLoading();

            if (result.success) {
                this.state.isDualWheel = false;
                this.startWheel(result.data.name, result.data.icon, result.data.options);
            } else {
                MoonUtils.showToast(result.error || '获取电影推荐失败');
            }
        } catch (error) {
            MoonUtils.hideLoading();
            MoonUtils.showToast(error.message);
        } finally {
            this.state.aiGenerating = false;
            if (btn) btn.disabled = false;
        }
    },

    // ========== Feature 4: 转盘结果 AI 解读 ==========

    async _interpretResult(wheelName, resultOption) {
        const interpretEl = this._safeGetElement('resultInterpret');
        if (!interpretEl) return;

        interpretEl.style.display = '';
        interpretEl.innerHTML = '<div class="interpret-loading">✨ 月影正在解读命运的选择...</div>';

        try {
            const result = await WheelAIGenerator.interpretResult(wheelName, resultOption);
            if (result.success) {
                interpretEl.innerHTML = `<div class="interpret-content">${MoonUtils.formatText(result.content)}</div>`;
            } else {
                interpretEl.style.display = 'none';
            }
        } catch (error) {
            interpretEl.style.display = 'none';
        }
    },

    // ========== AI 通用生成 ==========

    async aiGenerate() {
        const input = this._safeGetElement('aiInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) { MoonUtils.showToast('请输入描述'); return; }
        if (this.state.aiGenerating) return;

        this.state.aiGenerating = true;
        const btn = this._safeGetElement('aiGenerateBtn');
        if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

        try {
            if (!MoonConfig.get('apiKey')) {
                throw new Error('请先配置 API Key');
            }

            const result = await WheelAIGenerator.generateFromText(text);
            if (result.success) {
                this.state.isDualWheel = false;
                this.startWheel(result.data.name, result.data.icon, result.data.options);
            } else {
                MoonUtils.showToast(result.error);
            }
        } catch (error) {
            MoonUtils.showToast(error.message);
        } finally {
            this.state.aiGenerating = false;
            if (btn) { btn.disabled = false; btn.textContent = '✨ AI生成'; }
        }
    },

    // ========== Feature 5: 自定义权重 ==========

    startCustom() {
        const input = this._safeGetElement('customInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) { MoonUtils.showToast('请输入选项'); return; }

        const lines = text.split(/[\n]+/).map(s => s.trim()).filter(s => s.length > 0);
        const options = [];
        const weights = [];
        let hasWeights = false;

        lines.forEach(line => {
            // 支持逗号分割的多个选项
            const parts = line.split(/[,，、;；]+/).map(s => s.trim()).filter(s => s.length > 0);
            parts.forEach(part => {
                // 解析 选项:权重 格式
                const colonMatch = part.match(/^(.+):(\d+(?:\.\d+)?)$/);
                if (colonMatch) {
                    options.push(colonMatch[1].trim());
                    weights.push(parseFloat(colonMatch[2]));
                    hasWeights = true;
                } else {
                    options.push(part);
                    weights.push(1);
                }
            });
        });

        if (options.length < 2) { MoonUtils.showToast('至少需要2个选项'); return; }
        if (options.length > 12) { MoonUtils.showToast('最多支持12个选项'); return; }

        this.state.isDualWheel = false;
        this.startWheel('自定义转盘', '🎡', options, hasWeights ? weights : null);
    }
};

document.addEventListener('DOMContentLoaded', () => WheelApp.init());
