// 月影决策屋 - 转盘主逻辑

const WheelApp = {
    state: {
        currentView: 'home',
        wheel: null,
        currentPreset: null,
        customOptions: [],
        aiGenerating: false
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

        // OCR占位
        const ocrBtn = this._safeGetElement('ocrBtn');
        if (ocrBtn) ocrBtn.addEventListener('click', () => this.ocrGenerate());

        // 地理位置占位
        const locationBtn = this._safeGetElement('locationBtn');
        if (locationBtn) locationBtn.addEventListener('click', () => this.locationGenerate());

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
        if (newWheelBtn) newWheelBtn.addEventListener('click', () => this.showView('home'));
    },

    // 2.2: 视图切换焦点管理
    showView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (target) {
            target.classList.add('active');
            this.state.currentView = viewName;
            // 2.2: 焦点移到新视图标题
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
        this.startWheel(preset.name, preset.icon, preset.options, preset.weights);
    },

    startWheel(name, icon, options, weights = null) {
        const wheelTitle = this._safeGetElement('wheelTitle');
        if (wheelTitle) wheelTitle.textContent = `${icon} ${name}`;

        const canvas = this._safeGetElement('wheelCanvas');
        if (!canvas) return;
        this.state.wheel = new WheelRenderer(canvas, options, weights);
        this.state.wheel.onResult = (result) => this.showResult(result, name);

        // 重置结果区域
        const resultArea = this._safeGetElement('resultArea');
        const spinBtn = this._safeGetElement('spinBtn');
        if (resultArea) resultArea.style.display = 'none';
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
        if (resultArea) resultArea.style.display = 'none';
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

        // 添加闪烁效果
        MoonEffects.createFlash('rgba(212,168,67,0.2)');
    },

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

    ocrGenerate() {
        MoonUtils.showToast('截图识别功能即将上线，敬请期待！');
    },

    locationGenerate() {
        MoonUtils.showToast('附近美食功能即将上线！');
    },

    startCustom() {
        const input = this._safeGetElement('customInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) { MoonUtils.showToast('请输入选项'); return; }

        const options = text.split(/[\n,，、;；]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (options.length < 2) { MoonUtils.showToast('至少需要2个选项'); return; }
        if (options.length > 12) { MoonUtils.showToast('最多支持12个选项'); return; }

        this.startWheel('自定义转盘', '🎡', options);
    }
};

document.addEventListener('DOMContentLoaded', () => WheelApp.init());
