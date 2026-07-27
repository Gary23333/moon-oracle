import { TAROT_CARDS } from '../tarot/cards-data.js';
import { MoonUtils } from '../common/utils.js';

const YES_KEYWORDS = ['开始', '冒险', '创造', '胜利', '成功', '喜悦', '丰饶', '力量', '希望', '灵感', '机遇', '进展', '行动', '前进', '勇气', '信心', '认可', '成就', '自由', '幸福', '圆满', '新开始', '无限可能', '机遇降临', '顺势而为', '命运转折', '觉醒', '重生', '蜕变', '爱', '和谐', '连接', '伙伴关系', '满足', '愿望实现', '情感丰盛', '清晰思维', '突破', '真理', '策略', '独立', '理性', '公正', '新机会', '财富', '物质丰盛', '团队合作', '技能', '专业', '勤奋', '专注', '耐心等待', '投资', '长期回报', '慷慨', '给予', '公平', '分享'];

const NO_KEYWORDS = ['鲁莽', '欺骗', '失败', '悲伤', '痛苦', '结束', '损失', '背叛', '分离', '冲突', '阻碍', '限制', '束缚', '焦虑', '恐惧', '噩梦', '担忧', '不公正', '偏见', '失衡', '极端', '过度', '忽视', '逃避', '停滞', '抗拒', '拖延', '犹豫', '放弃', '退缩', '疲惫', '固执', '自私', '贪婪', '嫉妒', '缺乏', '错过', '错失', '混乱', '误解', '滥用', '专制', '僵化', '教条', '叛逆', '非传统', '质疑', '盲目', '冒失', '能力不足', '缺乏行动', '忽视直觉', '秘密揭露', '情绪波动', '表面化', '依赖他人', '创造力受阻', '过度溺爱', '忽视自我', '过度控制', '缺乏纪律', '教条束缚', '独立思考', '关系失衡', '选择困难', '价值观冲突', '不和谐', '失去方向', '攻击性强', '失控偏航', '缺乏动力', '自我怀疑', '缺乏自信', '暴力冲动', '过度孤立', '逃避现实', '拒绝帮助', '厄运低谷', '抵抗变化', '错失良机', '失控感', '逃避责任', '拖延犹豫', '拒绝放手', '自怜', '抗拒改变', '停滞不前', '恐惧结束', '无法放手', '极端', '缺乏耐心', '过度放纵', '欲望束缚', '物质执念', '阴影面', '诱惑考验', '逃避变革', '灾难延缓', '恐惧改变', '内在动荡', '失去希望', '脱离现实', '信心动摇', '幻象迷雾', '内在恐惧', '短暂低落', '过度乐观', '自我中心', '延迟的成功', '自我怀疑', '拒绝反思', '逃避召唤', '无法原谅', '未完成', '缺乏闭合', '半途而废', '创意受阻', '缺乏热情', '延迟', '缺乏规划', '恐惧未知', '挫折', '缺乏远见', '不稳定', '缺乏和谐', '过渡期', '避免冲突', '内在矛盾', '妥协', '失败', '缺乏认可', '自大', '放弃', '压力过大', '退缩', '延迟', '阻碍', '等待', '疲惫', '固执', '过度防御', '释放负担', '委派', '减轻压力', '缺乏方向', '不成熟', '延迟消息', '鲁莽', '挫败感', '嫉妒', '自私', '缺乏安全感', '专制', '冲动', '缺乏耐心', '情感封闭', '空虚', '错失爱情', '分离', '不和谐', '误解', '过度放纵', '孤立', '社交疲惫', '不满', '重新评估', '内省', '失落', '悲伤', '悔恨', '失望', '沉溺过去', '不切实际', '成长', '幻想', '选择', '白日梦', '清醒', '做出决定', '专注', '离开', '放弃', '寻找意义', '精神之旅', '徘徊', '恐惧改变', '留恋', '贪婪', '不满', '空虚', '家庭矛盾', '不和谐', '理想破灭', '情感不成熟', '创意受阻', '不切实际', '不切实际', '情感操控', '嫉妒', '情绪化', '依赖', '不安全感', '情绪压抑', '操控', '冷酷', '混乱', '误解', '滥用权力', '僵局', '艰难选择', '回避', '信息过载', '做出决定', '释放', '心碎', '悲伤', '分离', '背叛', '释放痛苦', '原谅', '康复', '疲惫', '不安', '恢复行动', '冲突', '失败', '赢了战斗输了战争', '和解', '放下', '原谅', '过渡', '离开', '疗愈之旅', '前进', '停滞', '无法离开', '困境', '策略', '欺骗', '独自行动', '逃避', '坦白', '面对后果', '改变策略', '束缚', '限制', '自我设限', '困惑', '解放', '新视角', '自由', '焦虑', '噩梦', '担忧', '失眠', '最坏情况已过', '希望', '康复', '结束', '背叛', '痛苦终结', '重新开始', '恢复', '无法放手', '拖延结束', '好奇心', '新想法', '警觉', '沟通', '闲话', '缺乏计划', '言辞尖锐', '果断', '行动迅速', '勇往直前', '竞争', '鲁莽', '冲动', '缺乏耐心', '独立', '清晰', '公正', '直言不讳', '冷酷', '偏见', '尖酸刻薄', '权威', '理性', '公正', '清晰判断', '专制', '滥用权力', '冷酷无情', '新机会', '财富', '物质丰盛', '新开始', '错失机会', '财务不稳', '缺乏规划', '平衡', '适应', '灵活', '多任务', '失衡', '过度承担', '混乱', '团队合作', '技能', '专业', '建设', '缺乏团队精神', '平庸', '方向不明', '保守', '安全', '控制', '储蓄', '贪婪', '过度执着', '释放', '贫困', '困难', '失去', '孤立', '恢复', '帮助到来', '走出困境', '慷慨', '给予', '公平', '分享', '自私', '债务', '不公平', '耐心等待', '投资', '长期回报', '评估', '缺乏耐心', '急于求成', '浪费精力', '勤奋', '专注', '技能提升', '匠心', '缺乏专注', '重复工作', '无聊'];

const SUIT_WEIGHTS = {
    wands: { yes: 1.2, no: 0.8, maybe: 1.0 },
    cups: { yes: 1.0, no: 1.0, maybe: 1.1 },
    swords: { yes: 0.9, no: 1.1, maybe: 1.0 },
    pentacles: { yes: 1.1, no: 0.9, maybe: 1.0 },
    major: { yes: 1.0, no: 1.0, maybe: 1.2 }
};

export const MoonOracle = {
    _getCardKeywords(card, isReversed) {
        return isReversed ? card.reversedKeywords : card.uprightKeywords;
    },

    _calculateScore(card, isReversed) {
        const keywords = this._getCardKeywords(card, isReversed);
        let yesScore = 0;
        let noScore = 0;

        for (const kw of keywords) {
            if (YES_KEYWORDS.includes(kw)) {
                yesScore += 1;
            } else if (NO_KEYWORDS.includes(kw)) {
                noScore += 1;
            }
        }

        return { yesScore, noScore, total: yesScore + noScore };
    },

    _determineResult(card, isReversed) {
        const { yesScore, noScore, total } = this._calculateScore(card, isReversed);
        const arcana = card.arcana === 'major' ? 'major' : card.suit;
        const weights = SUIT_WEIGHTS[arcana] || SUIT_WEIGHTS.major;

        let rawYes = yesScore;
        let rawNo = noScore;
        let rawMaybe = total === 0 ? 2 : (total - yesScore - noScore) * 2;

        const weightedYes = rawYes * weights.yes;
        const weightedNo = rawNo * weights.no;
        const weightedMaybe = rawMaybe * weights.maybe;

        const totalWeighted = weightedYes + weightedNo + weightedMaybe;
        
        const rand = Math.random() * totalWeighted;

        if (rand < weightedYes) {
            return 'yes';
        } else if (rand < weightedYes + weightedNo) {
            return 'no';
        } else {
            return 'maybe';
        }
    },

    _generateComment(card, isReversed, result) {
        const arcana = card.arcana === 'major' ? '大阿卡纳' : 
            card.suit === 'wands' ? '权杖' : 
            card.suit === 'cups' ? '圣杯' : 
            card.suit === 'swords' ? '宝剑' : '星币';

        const resultText = result === 'yes' ? '是' : result === 'no' ? '否' : '待定';
        
        let comment = '';
        
        if (result === 'yes') {
            comment = `✨ ${card.name}(${isReversed ? '逆位' : '正位'}) · ${arcana}\n\n${card.advice}\n\n月影提示：牌面显示积极信号，大胆行动吧。`;
        } else if (result === 'no') {
            comment = `🌙 ${card.name}(${isReversed ? '逆位' : '正位'}) · ${arcana}\n\n${card.advice}\n\n月影提示：时机尚未成熟，建议谨慎行事。`;
        } else {
            comment = `🔮 ${card.name}(${isReversed ? '逆位' : '正位'}) · ${arcana}\n\n${card.advice}\n\n月影提示：答案在风中，需要更多时间和信息来确认。`;
        }

        return comment;
    },

    draw(userQuestion) {
        const cardIndex = MoonUtils.randomInt(0, TAROT_CARDS.length - 1);
        const card = TAROT_CARDS[cardIndex];
        const isReversed = MoonUtils.getRandomOrientation() === '逆位';
        const result = this._determineResult(card, isReversed);
        const comment = this._generateComment(card, isReversed, result);

        return {
            type: 'oracle',
            question: userQuestion,
            card: {
                id: card.id,
                name: card.name,
                nameEn: card.nameEn,
                arcana: card.arcana,
                suit: card.suit,
                element: card.element,
                symbol: card.symbol || '',
                isReversed: isReversed,
                keywords: this._getCardKeywords(card, isReversed),
                meaning: isReversed ? card.reversedMeaning : card.uprightMeaning
            },
            result: result,
            resultText: result === 'yes' ? '是' : result === 'no' ? '否' : '待定',
            comment: comment
        };
    }
};