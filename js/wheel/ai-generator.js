// 月影决策屋 - AI 生成转盘

const WheelAIGenerator = {
    async generateFromText(text) {
        const prompt = MoonConfig.current.wheelPrompts?.generate || MoonConfig.defaults.wheelPrompts.generate;
        const userMessage = `用户输入：${text}`;
        
        try {
            const result = await MoonAPI.chatSingle(prompt, userMessage, { thinking: false });
            const content = MoonUtils.stripThinking(result.content);
            
            // 尝试解析JSON（非贪婪匹配）
            const jsonMatch = content.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
                try {
                    const data = JSON.parse(jsonMatch[0]);
                    if (data.options && Array.isArray(data.options) && data.options.length >= 2) {
                        return {
                            success: true,
                            data: {
                                name: data.name || '自定义转盘',
                                icon: data.icon || '🎡',
                                options: data.options.slice(0, 12)
                            }
                        };
                    }
                } catch (parseError) {
                    console.error('JSON解析失败:', parseError);
                }
            }
            return { success: false, error: '无法解析转盘数据，请换个描述试试' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // OCR占位功能
    async fromOCR(imageFile) {
        // TODO: 后续接入OCR API
        return {
            success: false,
            error: '截图识别功能即将上线，敬请期待！'
        };
    },

    // 地理位置占位功能
    async fromLocation(cuisine = null) {
        // TODO: 后续接入地图API
        const cuisineWheel = {
            name: '选菜系', icon: '🍽️',
            options: ['火锅','烧烤','日料','韩料','西餐','川菜','粤菜','湘菜']
        };
        
        if (cuisine) {
            // 二级转盘 - 根据菜系返回餐厅
            return {
                success: false,
                error: '附近餐厅查询功能即将上线！',
                fallback: {
                    name: `${cuisine}餐厅`, icon: '📍',
                    options: ['正在接入地图API...']
                }
            };
        }
        
        return {
            success: true,
            data: cuisineWheel,
            isDual: true,
            secondWheelPrompt: '请在第一个转盘选择菜系后，我们将为你查询附近餐厅'
        };
    },

    // 电影选择器占位功能
    async getMovies() {
        // TODO: 后续接入电影API
        return {
            success: false,
            error: '电影选择器即将上线！',
            fallback: {
                name: '电影类型', icon: '🎬',
                options: ['动作片','喜剧片','爱情片','科幻片','恐怖片','悬疑片','动画片','纪录片']
            }
        };
    }
};
