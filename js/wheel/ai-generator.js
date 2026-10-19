// 月影决策屋 - AI 生成转盘

import { MoonConfig } from '../common/config.js';
import { MoonAPI } from '../common/api.js';
import { MoonUtils } from '../common/utils.js';
import { resolveTaskRoute } from '../common/routing.js';

// Vision 截图识别系统提示词（内联常量，避免改动 config.js）
const VISION_OCR_PROMPT = `你是转盘生成器。请仔细观察用户提供的截图图片，识别其中的列表、选项或文字内容。
将识别结果整理为一个转盘：提取名称、图标和选项列表（4-12 个选项，每个 2-8 个字，尽量还原截图原文）。
仅返回严格 JSON，不要任何额外说明、注释或代码块标记：
{"name":"...","icon":"emoji","options":["...", "..."]}
示例输出：{"name":"截图识别转盘","icon":"📷","options":["选项一","选项二","选项三","选项四"]}`;

export const WheelAIGenerator = {
    // 通用 AI 转盘生成（结构化 JSON，保持非流式）：从 JSON 响应中提取转盘数据
    async _parseWheelFromAI(prompt, userMessage, taskKey = 'generate') {
        const result = await MoonAPI.chatSingle(prompt, userMessage, resolveTaskRoute(taskKey));
        return this._parseWheelData(MoonUtils.stripThinking(result.content));
    },

    // 从模型返回内容中解析转盘 JSON 数据（正则提取 → JSON.parse → 校验）
    _parseWheelData(content) {
        if (content) {
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
                } catch (e) {
                    console.error('JSON解析失败:', e);
                }
            }
        }
        return { success: false, error: '无法解析转盘数据，请换个描述试试' };
    },

    async generateFromText(text) {
        const prompt = MoonConfig.current.wheelPrompts?.generate || MoonConfig.defaults.wheelPrompts.generate;
        try {
            return await this._parseWheelFromAI(prompt, `用户输入：${text}`, 'generate');
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // ========== Feature 1: OCR 截图识别（DeepSeek Vision 多模态） ==========

    async fromOCR(imageFile) {
        if (!imageFile) {
            return { success: false, error: '请选择图片文件' };
        }
        if (!imageFile.type || !imageFile.type.startsWith('image/')) {
            return { success: false, error: '请选择图片文件（仅支持图片格式）' };
        }

        const maxSize = 10 * 1024 * 1024;
        if (imageFile.size > maxSize) {
            return { success: false, error: `图片超过 10MB 限制，请选择更小的图片（当前大小：${(imageFile.size / 1024 / 1024).toFixed(1)}MB）` };
        }

        // 读取图片为 base64 data URL
        let dataUrl;
        try {
            dataUrl = await this._readFileAsDataURL(imageFile);
        } catch (e) {
            return { success: false, error: '图片加载失败：无法读取图片文件' };
        }

        // 防御式读取视觉模型配置由 resolveTaskRoute('vision') 统一解析
        const messages = [
            { role: 'system', content: VISION_OCR_PROMPT },
            MoonAPI.buildVisionMessage('请识别这张截图中的列表/选项文字，并据此生成一个转盘。', dataUrl)
        ];

        try {
            // 结构化识别保持非流式；vision 任务默认关闭思考
            const result = await MoonAPI.chat(messages, resolveTaskRoute('vision', { thinking: false }));
            const content = MoonUtils.stripThinking(result.content);

            // 优先按结构化 JSON 解析
            const parsed = this._parseWheelData(content);
            if (parsed.success) {
                return parsed;
            }

            // 回退：多策略文本提取
            const options = this._extractOptionsFromText(content || '');
            if (options.length >= 2) {
                return {
                    success: true,
                    data: {
                        name: '截图识别转盘',
                        icon: '📷',
                        options: options.slice(0, 12)
                    }
                };
            }

            return {
                success: false,
                error: '识别内容无法提取足够选项，请手动输入',
                rawText: content
            };
        } catch (error) {
            return { success: false, error: this._mapVisionError(error) };
        }
    },

    // 读取图片文件为 base64 data URL
    _readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('图片加载失败：无法读取图片文件'));
            reader.readAsDataURL(file);
        });
    },

    // 将 Vision 调用错误映射为友好中文提示
    _mapVisionError(error) {
        const message = error?.message || '';

        if (message.includes('API Key') || message.includes('401')) {
            return 'API Key 无效或未配置，请在配置中设置 API Key';
        }
        if (message.includes('vision') || message.includes('不支持') || message.includes('model')) {
            return '当前模型不支持视觉识别，请在配置中把「视觉模型」设为 deepseek-flash';
        }
        if (message.includes('fetch') || message.includes('Failed to fetch') ||
            message.includes('network') || message.includes('网络') ||
            message.includes('timeout') || message.includes('超时')) {
            return '网络错误：无法连接 AI 服务，请检查网络';
        }
        return message || 'OCR 识别失败';
    },

    _extractOptionsFromText(text) {
        // 多策略提取选项
        const lines = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);

        // 策略1: 每行一个选项（去掉行号前缀）
        const cleaned = lines.map(line =>
            line.replace(/^[\d]+[.、)）\s]+/, '').replace(/^[·•\-]\s*/, '').trim()
        ).filter(s => s.length >= 1 && s.length <= 20);

        if (cleaned.length >= 2) return cleaned;

        // 策略2: 按逗号/顿号分割
        const commaSplit = text.split(/[,，、;；]+/).map(s => s.trim()).filter(s => s.length >= 1 && s.length <= 20);
        if (commaSplit.length >= 2) return commaSplit;

        return cleaned;
    },

    // ========== Feature 2: 附近美食双转盘 ==========

    async fromLocation() {
        try {
            const coords = await this._getGeolocation();
            const prompt = MoonConfig.current.wheelPrompts?.location || MoonConfig.defaults.wheelPrompts.location;
            const locationDesc = `用户位置：纬度${coords.lat.toFixed(4)}，经度${coords.lng.toFixed(4)}`;
            const result = await this._parseWheelFromAI(prompt, locationDesc, 'generate');

            if (result.success) {
                result.isDual = true;
                result.location = coords;
                result.secondWheelPrompt = '选中菜系后，将为你推荐附近的具体餐厅';
            }
            return result;
        } catch (error) {
            // 定位失败时用 AI 生成通用美食转盘
            if (error.code === 1 || error.message.includes('denied') || error.message.includes('Permission')) {
                MoonUtils.showToast('定位已拒绝，为你生成通用美食转盘');
                const prompt = MoonConfig.current.wheelPrompts?.location || MoonConfig.defaults.wheelPrompts.location;
                return await this._parseWheelFromAI(prompt, '用户无法定位，推荐中国常见美食分类', 'generate');
            }
            return { success: false, error: error.message || '获取位置失败' };
        }
    },

    async fromLocationDetail(cuisine, coords) {
        try {
            const prompt = MoonConfig.current.wheelPrompts?.locationDetail || MoonConfig.defaults.wheelPrompts.locationDetail;
            const userMsg = `用户位置：纬度${coords.lat.toFixed(4)}，经度${coords.lng.toFixed(4)}。选择的菜系：${cuisine}。请推荐附近该类型的餐厅或美食去处。`;
            return await this._parseWheelFromAI(prompt, userMsg, 'generate');
        } catch (error) {
            return { success: false, error: error.message || '获取餐厅推荐失败' };
        }
    },

    _getGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持定位功能'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                err => reject(err),
                { timeout: 10000, maximumAge: 300000 }
            );
        });
    },

    // ========== Feature 3: 电影选择器 ==========

    async getMovies(genre = null) {
        try {
            const prompt = MoonConfig.current.wheelPrompts?.movie || MoonConfig.defaults.wheelPrompts.movie;
            const genreText = genre || '综合各类别热门电影';
            const userMsg = `推荐${genreText}，优先近期热门和经典佳作，返回一个电影选择转盘。`;
            return await this._parseWheelFromAI(prompt, userMsg, 'generate');
        } catch (error) {
            return { success: false, error: error.message || '获取电影推荐失败' };
        }
    },

    // ========== Feature 4: 转盘结果 AI 解读 ==========

    async interpretResult(wheelName, resultOption, callbacks = {}) {
        try {
            const prompt = MoonConfig.current.wheelPrompts?.resultInterpret || MoonConfig.defaults.wheelPrompts.resultInterpret;
            const userMsg = `转盘名称：${wheelName}，命运选择的结果是：「${resultOption}」。请给出有趣的解读。`;
            const route = resolveTaskRoute('interpret');
            const result = await MoonAPI.streamChat(
                [
                    { role: 'system', content: prompt },
                    { role: 'user', content: userMsg }
                ],
                route,
                {
                    onDelta: callbacks.onDelta,
                    onReasoning: callbacks.onReasoning
                }
            );
            return { success: true, content: result.content, thinking: result.thinking };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
