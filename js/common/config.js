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
示例输出：{"name":"晚上吃什么","icon":"🍽️","options":["火锅","烧烤","寿司","麻辣烫","炒饭","面条","饺子","披萨"]}`,
            location: `你是一个美食推荐助手。根据用户的地理位置（经纬度），推荐当地常见的菜系。
返回JSON格式，选项6-10个，每个2-4个字，应是当地常见的餐饮类型。
示例输出：{"name":"附近吃什么","icon":"🍽️","options":["火锅","烧烤","川菜","粤菜","日料","西餐","奶茶","小吃"]}`,
            locationDetail: `你是一个美食推荐助手。根据用户位置和选择的菜系，推荐附近的餐厅或美食去处。
返回JSON格式，选项4-8个，每个2-6个字。
示例输出：{"name":"火锅店推荐","icon":"🍲","options":["海底捞","呷哺呷哺","小龙坎","德庄火锅","小肥羊","谭鸭血"]}`,
            movie: `你是一个电影推荐助手。根据用户选择的电影类型，推荐值得观看的电影。
返回JSON格式，选项6-10个，每个2-8个字，优先推荐近期热门和经典佳作。
示例输出：{"name":"科幻电影推荐","icon":"🚀","options":["星际穿越","沙丘2","流浪地球2","信条","黑客帝国","银翼杀手2049"]}`,
            resultInterpret: `你是一个有趣的结果解读师。用户通过命运转盘做出了选择，请给出一段有趣的解读。
要求：
1. 肯定命运的选择，给出积极的解读
2. 可以引用相关的趣闻、梗或名言
3. 100-200字，幽默有趣，带点神秘感
4. 使用emoji点缀`
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
