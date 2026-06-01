// 月影决策屋 - 转盘主逻辑

const WheelApp = {
    state: {
        currentView: 'home',
        wheel: null,
        currentPreset: null,
        customOptions: [],
        aiGenerating: false
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
        document.getElementById('aiGenerateBtn').addEventListener('click', () => this.aiGenerate());
        document.getElementById('aiInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); this.aiGenerate(); }
        });

        // OCR占位
        document.getElementById('ocrBtn').addEventListener('click', () => this.ocrGenerate());

        // 地理位置占位
        document.getElementById('locationBtn').addEventListener('click', () => this.locationGenerate());

        // 自定义转盘
        document.getElementById('customStartBtn').addEventListener('click', () => this.startCustom());
        document.getElementById('customInput').addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.startCustom(); }
        });

        // 转盘操作
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());
        document.getElementById('respinBtn').addEventListener('click', () => this.respin());
        document.getElementById('newWheelBtn').addEventListener('click', () => this.showView('home'));
    },

    showView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (target) {
            target.classList.add('active');
            this.state.currentView = viewName;
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
        document.getElementById('wheelTitle').textContent = `${icon} ${name}`;
        
        const canvas = document.getElementById('wheelCanvas');
        this.state.wheel = new WheelRenderer(canvas, options, weights);
        this.state.wheel.onResult = (result) => this.showResult(result, name);
        
        // 重置结果区域
        document.getElementById('resultArea').style.display = 'none';
        document.getElementById('spinBtn').style.display = '';
        
        this.showView('wheel');
    },

    spin() {
        if (this.state.wheel && !this.state.wheel.isSpinning) {
            document.getElementById('spinBtn').disabled = true;
            this.state.wheel.spin();
        }
    },

    respin() {
        document.getElementById('resultArea').style.display = 'none';
        document.getElementById('spinBtn').style.display = '';
        document.getElementById('spinBtn').disabled = false;
        this.state.wheel.rotation = 0;
        this.state.wheel.draw();
    },

    showResult(result, wheelName) {
        document.getElementById('spinBtn').style.display = 'none';
        document.getElementById('resultArea').style.display = '';
        document.getElementById('resultOption').textContent = result.option;
        document.getElementById('resultWheelName').textContent = wheelName;
        
        // 添加闪烁效果
        MoonEffects.createFlash('rgba(212,168,67,0.2)');
    },

    async aiGenerate() {
        const input = document.getElementById('aiInput');
        const text = input.value.trim();
        if (!text) { MoonUtils.showToast('请输入描述'); return; }
        if (this.state.aiGenerating) return;

        this.state.aiGenerating = true;
        const btn = document.getElementById('aiGenerateBtn');
        btn.disabled = true;
        btn.textContent = '生成中...';

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
            btn.disabled = false;
            btn.textContent = '✨ AI生成';
        }
    },

    ocrGenerate() {
        MoonUtils.showToast('截图识别功能即将上线，敬请期待！');
    },

    locationGenerate() {
        MoonUtils.showToast('附近美食功能即将上线！');
    },

    startCustom() {
        const input = document.getElementById('customInput');
        const text = input.value.trim();
        if (!text) { MoonUtils.showToast('请输入选项'); return; }

        const options = text.split(/[\n,，、;；]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (options.length < 2) { MoonUtils.showToast('至少需要2个选项'); return; }
        if (options.length > 12) { MoonUtils.showToast('最多支持12个选项'); return; }

        this.startWheel('自定义转盘', '🎡', options);
    }
};

document.addEventListener('DOMContentLoaded', () => WheelApp.init());
