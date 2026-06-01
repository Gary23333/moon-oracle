// 月影决策屋 - 牌阵定义

const TAROT_SPREADS = {
    single: {
        name: '单牌占卜',
        cardCount: 1,
        icon: '🔮',
        positions: ['核心答案'],
        desc: '最直接的核心答案，适合简单问题和每日指引',
        layout: [{x:50,y:50}]
    },
    three_card: {
        name: '三牌占卜',
        cardCount: 3,
        icon: '🌙✨☀️',
        positions: ['过去','现在','未来'],
        desc: '揭示时间脉络，看清事情的发展走向',
        layout: [{x:25,y:50},{x:50,y:50},{x:75,y:50}]
    },
    love_cross: {
        name: '爱情十字',
        cardCount: 5,
        icon: '💕',
        positions: ['你的感受','对方感受','关系现状','障碍','结果'],
        desc: '专为感情问题设计，全方位分析情感关系',
        layout: [{x:50,y:25},{x:50,y:75},{x:50,y:50},{x:25,y:50},{x:75,y:50}]
    },
    career_pyramid: {
        name: '事业金字塔',
        cardCount: 5,
        icon: '💼',
        positions: ['现状基础','面临挑战','你的优势','环境影响','最终结果'],
        desc: '清晰展示事业发展方向和策略',
        layout: [{x:50,y:80},{x:30,y:55},{x:70,y:55},{x:50,y:30},{x:50,y:10}]
    },
    choice: {
        name: '二选一',
        cardCount: 5,
        icon: '⚖️',
        positions: ['当前状况','选项A','选项B','阻碍因素','最终建议'],
        desc: '帮助你在两个选择之间做出决定',
        layout: [{x:50,y:20},{x:25,y:55},{x:75,y:55},{x:50,y:75},{x:50,y:95}]
    },
    celtic: {
        name: '凯尔特十字',
        cardCount: 10,
        icon: '✦',
        positions: ['当前处境','面临挑战','潜意识基础','近期过去','可能结果','近期未来','自我认知','外界影响','希望与恐惧','最终结果'],
        desc: '最全面的牌阵，涵盖所有维度，适合重大问题',
        layout: [
            {x:40,y:45},{x:40,y:45,xOffset:15},
            {x:40,y:70},{x:20,y:45},{x:40,y:20},{x:60,y:45},
            {x:80,y:75},{x:80,y:60},{x:80,y:45},{x:80,y:30}
        ]
    },
    seasonal: {
        name: '四季牌阵',
        cardCount: 4,
        icon: '🌸🌻🍂❄️',
        positions: ['春季','夏季','秋季','冬季'],
        desc: '展望未来一年的运势走向',
        layout: [{x:25,y:30},{x:75,y:30},{x:25,y:70},{x:75,y:70}]
    },
    tree_of_life: {
        name: '生命之树',
        cardCount: 10,
        icon: '🌳',
        positions: ['王冠','智慧','理解','慈悲','力量','美丽','胜利','光辉','基础','王国'],
        desc: '对应卡巴拉生命之树的十个质点，探索人生深层意义',
        layout: [
            {x:50,y:5},{x:35,y:15},{x:65,y:15},
            {x:50,y:25},{x:30,y:40},{x:70,y:40},
            {x:50,y:50},{x:50,y:65},{x:50,y:80},{x:50,y:95}
        ]
    }
};

// 根据问题分类推荐牌阵
const CATEGORY_SPREAD_RECOMMEND = {
    love:     { recommend: 'love_cross', reason: '爱情十字牌阵专为感情问题设计，能全面分析双方感受和关系走向' },
    career:   { recommend: 'career_pyramid', reason: '事业金字塔能清晰展示你的优势、挑战和发展方向' },
    wealth:   { recommend: 'three_card', reason: '三牌阵揭示财运的时间脉络，看清过去现在和未来' },
    study:    { recommend: 'three_card', reason: '三牌阵帮你看清学业的过去、现在和未来趋势' },
    health:   { recommend: 'celtic', reason: '凯尔特十字全面分析身心状态，涵盖所有影响因素' },
    decision: { recommend: 'choice', reason: '二选一牌阵专为抉择设计，帮你看清两个选项的利弊' },
    daily:    { recommend: 'single', reason: '单牌占卜简洁有力，为你提供今日核心指引' },
    custom:   { recommend: null, reason: '根据你的问题复杂度，选择最合适的牌阵' }
};

// 获取牌阵信息
function getSpreadInfo(spreadType) {
    return TAROT_SPREADS[spreadType] || TAROT_SPREADS.single;
}
