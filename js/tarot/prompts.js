// 月影决策屋 - 塔罗提示词

import { MoonConfig } from '../common/config.js';
import { getCategoryById } from './classifier.js';
import { getSpreadInfo } from './spreads.js';
import { TAROT_CARDS } from './cards-data.js';

export const TAROT_PROMPTS = {
    getGreeting() {
        return MoonConfig.current.tarotPrompts?.greeting || MoonConfig.defaults.tarotPrompts.greeting;
    },

    // 稳定的解读格式模板（同一用户配置下逐字节一致，利于前缀缓存）
    readingTemplate() {
        return MoonConfig.current.tarotPrompts?.reading || MoonConfig.defaults.tarotPrompts.reading;
    },

    // 稳定的追问模板
    followupTemplate() {
        return MoonConfig.current.tarotPrompts?.followup || MoonConfig.defaults.tarotPrompts.followup;
    },

    // 只按 id 从完整牌库查取单张牌的牌义，不再内嵌 78 张全表
    _getCardData(card) {
        if (!card || card.id === undefined || card.id === null) return null;
        return TAROT_CARDS.find(c => c.id === card.id) || null;
    },

    // 组装单张牌的动态牌义块（仅注入这一张牌的 name / orientation / 牌义 / keywords）
    _formatCardBlock(card, index) {
        const data = this._getCardData(card);
        const isReversed = card.orientation === '逆位';
        const name = data?.name || card.name || '未知牌';
        const orientation = card.orientation || '正位';
        const meaning = data
            ? (isReversed ? data.reversedMeaning : data.uprightMeaning)
            : (card.meaning || '');
        const keywords = data
            ? (isReversed ? data.reversedKeywords : data.uprightKeywords)
            : (card.keywords || []);
        const position = card.position || '';

        return `🔮 第${index + 1}张牌——${position}
【牌名】${name}（${orientation}）
【关键词】${keywords.join('、')}
【牌义】${meaning}`;
    },

    // 动态块：当前占卜信息 + 本次抽到的每张牌牌义 + 解读要求（应拼接在稳定前缀之后）
    getReadingDynamic(context) {
        const cards = Array.isArray(context.cards) ? context.cards : [];
        const cardBlocks = cards.map((card, index) => this._formatCardBlock(card, index)).join('\n\n');

        return `## 当前占卜信息
- 用户问题：${context.question}
- 问题分类：${context.category}
- 牌阵类型：${context.spreadType}（${context.spreadName}）
- 用户补充细节：${context.details || '无'}

## 本次抽到的牌
${cardBlocks || '（无牌面数据）'}

## 解读要求
1. 先感谢用户提供的细节（如果有）
2. 逐张翻牌，使用格式：🔮 第X张牌——[位置含义]【牌名】(正位/逆位)
3. 每张牌结合用户细节解读
4. 最后给出整体解读、关键启示、建议指引、月影寄语`;
    },

    // 追问动态块（应拼接在稳定前缀 + followupTemplate 之后）
    getFollowupDynamic(context) {
        return `## 当前占卜信息
- 用户问题：${context.question}
- 之前的解读：${context.previousReading}
- 牌阵类型：${context.spreadType}

## 回答要求
1. 回答用户关于本次占卜的后续问题
2. 可以对特定牌提供更详细的解读
3. 在已有牌的范围内深入，不引入新牌
4. 保持解读的一致性
5. 保持月影的角色和神秘氛围`;
    },

    getDetailQuestion(category, spreadType) {
        const base = MoonConfig.current.tarotPrompts?.detailQuestion || MoonConfig.defaults.tarotPrompts.detailQuestion;
        const cat = getCategoryById(category);
        const spread = getSpreadInfo(spreadType);

        return `${base}

用户选择了【${cat.name}】分类，将使用【${spread.name}】进行占卜。

根据分类提出2-3个相关问题，帮助用户补充细节。`;
    }
};
