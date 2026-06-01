// 月影决策屋 - 预设转盘数据

const WHEEL_PRESETS = {
    lunch: {
        name: '中午吃什么', icon: '🍜', category: 'food',
        desc: '选择困难症终结者',
        options: ['火锅','烧烤','寿司','麻辣烫','黄焖鸡','螺蛳粉','拉面','麦当劳','沙县小吃','麻辣香锅','酸菜鱼','披萨'],
        weights: [15,12,10,10,8,8,8,8,7,7,5,2]
    },
    crush: {
        name: 'TA喜不喜欢我', icon: '💕', category: 'love',
        desc: '测测TA的心意',
        options: ['超级喜欢！','有好感','把你当朋友','在观察中','有点心动','还需要时间','你猜~','命中注定'],
        weights: [15,20,15,15,10,10,5,10]
    },
    yesno: {
        name: '是还是否', icon: '✅', category: 'decision',
        desc: '命运帮你做决定',
        options: ['是！','否！','再想想','问问别人','明天再说','随缘吧'],
        weights: [30,25,15,10,10,10]
    },
    movie: {
        name: '看啥电影', icon: '🎬', category: 'entertainment',
        desc: '今晚的观影指南',
        options: ['动作片','喜剧片','爱情片','科幻片','恐怖片','悬疑片','动画片','纪录片'],
        weights: [15,20,15,15,5,10,15,5]
    },
    drink: {
        name: '喝什么奶茶', icon: '🧋', category: 'food',
        desc: '今天喝什么好呢',
        options: ['珍珠奶茶','杨枝甘露','芋泥波波','芝士莓莓','柠檬茶','椰椰拿铁','烧仙草','红豆奶茶'],
        weights: [18,15,12,12,10,10,8,8]
    },
    exercise: {
        name: '今天运动啥', icon: '🏃', category: 'health',
        desc: '让命运决定你的运动',
        options: ['跑步','游泳','瑜伽','健身','骑行','跳绳','散步','打球'],
        weights: [15,12,15,15,10,10,13,10]
    },
    weekend: {
        name: '周末去哪玩', icon: '🎉', category: 'life',
        desc: '周末活动安排',
        options: ['看电影','逛街','宅家','爬山','聚餐','密室','KTV','展览'],
        weights: [15,15,20,10,15,8,10,7]
    },
    study: {
        name: '先学什么', icon: '📚', category: 'study',
        desc: '学习计划安排',
        options: ['数学','英语','专业课','编程','阅读','复习','笔记','刷题'],
        weights: [15,15,15,12,10,12,10,11]
    },
    travel: {
        name: '去哪旅行', icon: '✈️', category: 'life',
        desc: '下一站目的地',
        options: ['北京','上海','成都','杭州','重庆','西安','大理','三亚'],
        weights: [12,12,15,12,10,12,12,15]
    },
    mood: {
        name: '今天心情如何', icon: '🌈', category: 'life',
        desc: '测测今日心情指数',
        options: ['元气满满','小确幸','平淡如水','有点丧','需要治愈','佛系一天','浪到飞起','宅家快乐'],
        weights: [15,15,15,10,10,10,15,10]
    }
};

// 获取预设分类
const WHEEL_CATEGORIES = [
    { id: 'all', name: '全部', icon: '🎡' },
    { id: 'food', name: '吃什么', icon: '🍜' },
    { id: 'love', name: '感情', icon: '💕' },
    { id: 'decision', name: '决策', icon: '✅' },
    { id: 'entertainment', name: '娱乐', icon: '🎬' },
    { id: 'life', name: '生活', icon: '🌈' },
    { id: 'health', name: '健康', icon: '🏃' },
    { id: 'study', name: '学习', icon: '📚' }
];

function getPresetsByCategory(category) {
    if (category === 'all') return Object.entries(WHEEL_PRESETS).map(([id, p]) => ({id, ...p}));
    return Object.entries(WHEEL_PRESETS)
        .filter(([_, p]) => p.category === category)
        .map(([id, p]) => ({id, ...p}));
}
