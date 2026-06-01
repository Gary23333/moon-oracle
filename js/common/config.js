// 月影决策屋 - 配置管理

const MoonConfig = {
    defaults: {
        apiUrl: 'https://api.deepseek.com',
        apiKey: '',
        model: 'deepseek-v4-flash',
        thinkingEnabled: true,
        thinkingEffort: 'high',
        showThinking: false,
        typingSpeed: 30,
        soundEnabled: true,
        wheelResultAI: false,
        tarotPrompts: {
            greeting: `你是月影，月影塔罗屋的占卜师。用神秘、温暖、诗意的语言欢迎来访者，营造神秘氛围。
氛围描述：烛光摇曳，水晶球折射幽蓝光芒，乳香与薰衣草气息弥漫。
要求：150-250字，以询问用户疑问结尾，使用🌙✨🔮符号点缀。`,
            reading: `你是月影，月影塔罗屋的占卜师。用户已选牌并提供细节，你需要翻牌解读。
格式要求：
🔮 第X张牌——[位置含义]
【牌名】(正位/逆位)
[牌面意象描述]
[结合用户细节的牌义解读]

---
✨ **整体解读** [综合叙述，回应用户问题]
🔑 **关键启示** [3个要点]
🌟 **建议与指引** [具体建议]
🌙 **月影寄语** [温暖结语]`,
            followup: `你是月影，月影塔罗屋的占卜师。用户在追问占卜细节。
要求：保持解读一致性，在已有牌范围内深入回答。150-300字。`,
            detailQuestion: `你是月影，月影塔罗屋的占卜师。用户已选牌，解读前需了解更多细节。
根据问题类型提出2-3个相关问题，语气温暖好奇。100-150字。`
        },
        wheelPrompts: {
            generate: `你是转盘生成器。从用户输入中提取转盘名称、图标和选项列表。
返回JSON格式，选项4-12个，每个2-6个字。
示例输出：{"name":"晚上吃什么","icon":"🍽️","options":["火锅","烧烤","寿司","麻辣烫","炒饭","面条","饺子","披萨"]}`
        }
    },

    current: {},

    init() {
        this.current = this.load();
        return this.current;
    },

    _deepMerge(target, source) {
        const result = { ...target };
        for (const key of Object.keys(source)) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
                && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                result[key] = this._deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    load() {
        const saved = localStorage.getItem('moon_oracle_config');
        if (saved) {
            try {
                return this._deepMerge(this.defaults, JSON.parse(saved));
            } catch (e) {
                return { ...this.defaults };
            }
        }
        return { ...this.defaults };
    },

    save() {
        try {
            localStorage.setItem('moon_oracle_config', JSON.stringify(this.current));
        } catch (e) {
            console.warn('配置保存失败:', e.message);
        }
    },

    get(key) {
        return this.current[key] ?? this.defaults[key];
    },

    set(key, value) {
        this.current[key] = value;
        this.save();
    },

    reset() {
        this.current = { ...this.defaults };
        this.save();
    }
};
