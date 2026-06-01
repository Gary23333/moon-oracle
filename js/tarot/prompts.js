// 月影决策屋 - 塔罗提示词

const TAROT_PROMPTS = {
    getGreeting() {
        return MoonConfig.current.tarotPrompts?.greeting || MoonConfig.defaults.tarotPrompts.greeting;
    },

    getReading(context) {
        const base = MoonConfig.current.tarotPrompts?.reading || MoonConfig.defaults.tarotPrompts.reading;
        return `${base}

## 当前占卜信息
- 用户问题：${context.question}
- 问题分类：${context.category}
- 牌阵类型：${context.spreadType}（${context.spreadName}）
- 用户补充细节：${context.details || '无'}

## 78张大阿卡纳牌义参考
1 愚者：正位-新开始冒险纯真；逆位-鲁莽缺乏计划
2 魔术师：正位-创造力意志力掌控；逆位-操控欺骗
3 女祭司：正位-直觉智慧神秘；逆位-忽视直觉
4 女皇：正位-丰饶母性创造；逆位-依赖过度
5 皇帝：正位-权威秩序稳定；逆位-专制僵化
6 教皇：正位-传统信仰指引；逆位-教条束缚
7 恋人：正位-爱情选择结合；逆位-关系失衡
8 战车：正位-胜利意志前进；逆位-失去方向
9 力量：正位-勇气坚韧克制；逆位-自我怀疑
10 隐者：正位-内省独处智慧；逆位-过度孤立
11 命运之轮：正位-命运转折机遇；逆位-厄运低谷
12 正义：正位-公正平衡真相；逆位-不公正逃避
13 倒吊人：正位-牺牲新视角等待；逆位-无谓牺牲
14 死神：正位-结束转化重生；逆位-抗拒改变
15 节制：正位-平衡调和中庸；逆位-失衡极端
16 恶魔：正位-欲望束缚诱惑；逆位-挣脱束缚
17 塔：正位-突变崩塌觉醒；逆位-逃避变革
18 星星：正位-希望灵感治愈；逆位-失去希望
19 月亮：正位-潜意识直觉幻象；逆位-走出迷雾
20 太阳：正位-成功喜悦活力；逆位-短暂低落
21 审判：正位-觉醒重生审视；逆位-自我怀疑
22 世界：正位-圆满完成整合；逆位-未完成

小阿卡纳各花色含义：
- 权杖(火)：事业、激情、创造力
- 圣杯(水)：感情、直觉、情绪
- 宝剑(风)：思维、冲突、真相
- 星币(土)：物质、健康、实际

## 解读要求
1. 先感谢用户提供的细节（如果有）
2. 逐张翻牌，使用格式：🔮 第X张牌——[位置含义]【牌名】(正位/逆位)
3. 每张牌结合用户细节解读
4. 最后给出整体解读、关键启示、建议指引、月影寄语`;
    },

    getFollowup(context) {
        const base = MoonConfig.current.tarotPrompts?.followup || MoonConfig.defaults.tarotPrompts.followup;
        return `${base}

## 当前占卜信息
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
