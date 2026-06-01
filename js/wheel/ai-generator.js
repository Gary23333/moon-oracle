// 月影决策屋 - AI 生成转盘

const WheelAIGenerator = {
    _tesseractLoaded: false,

    // 通用 AI 转盘生成（从 JSON 响应中提取转盘数据）
    async _parseWheelFromAI(prompt, userMessage) {
        const result = await MoonAPI.chatSingle(prompt, userMessage, { thinking: false });
        const content = MoonUtils.stripThinking(result.content);
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
        return { success: false, error: '无法解析转盘数据，请换个描述试试' };
    },

    async generateFromText(text) {
        const prompt = MoonConfig.current.wheelPrompts?.generate || MoonConfig.defaults.wheelPrompts.generate;
        try {
            return await this._parseWheelFromAI(prompt, `用户输入：${text}`);
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // ========== Feature 1: OCR 截图识别 ==========

    async _loadTesseract() {
        if (this._tesseractLoaded && typeof Tesseract !== 'undefined') return true;
        // 按需从 CDN 加载 Tesseract.js
        return new Promise((resolve, reject) => {
            if (typeof Tesseract !== 'undefined') {
                this._tesseractLoaded = true;
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            script.onload = () => {
                this._tesseractLoaded = true;
                resolve(true);
            };
            script.onerror = () => reject(new Error('OCR 库加载失败，请检查网络'));
            document.head.appendChild(script);
        });
    },

    async fromOCR(imageFile) {
        try {
            await this._loadTesseract();

            const result = await Tesseract.recognize(imageFile, 'chi_sim+eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const pct = Math.round(m.progress * 100);
                        MoonUtils.showLoading(`正在识别文字... ${pct}%`);
                    }
                }
            });

            const text = result.data.text.trim();
            if (!text) {
                return { success: false, error: '未能识别出文字，请尝试更清晰的图片' };
            }

            // 从识别文本中提取选项
            const options = this._extractOptionsFromText(text);
            if (options.length < 2) {
                return {
                    success: false,
                    error: '识别内容无法提取足够选项，请手动输入',
                    rawText: text
                };
            }

            return {
                success: true,
                data: {
                    name: '截图识别转盘',
                    icon: '📷',
                    options: options.slice(0, 12)
                }
            };
        } catch (error) {
            return { success: false, error: error.message || 'OCR 识别失败' };
        }
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
            const result = await this._parseWheelFromAI(prompt, locationDesc);

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
                return await this._parseWheelFromAI(prompt, '用户无法定位，推荐中国常见美食分类');
            }
            return { success: false, error: error.message || '获取位置失败' };
        }
    },

    async fromLocationDetail(cuisine, coords) {
        try {
            const prompt = MoonConfig.current.wheelPrompts?.locationDetail || MoonConfig.defaults.wheelPrompts.locationDetail;
            const userMsg = `用户位置：纬度${coords.lat.toFixed(4)}，经度${coords.lng.toFixed(4)}。选择的菜系：${cuisine}。请推荐附近该类型的餐厅或美食去处。`;
            return await this._parseWheelFromAI(prompt, userMsg);
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
            return await this._parseWheelFromAI(prompt, userMsg);
        } catch (error) {
            return { success: false, error: error.message || '获取电影推荐失败' };
        }
    },

    // ========== Feature 4: 转盘结果 AI 解读 ==========

    async interpretResult(wheelName, resultOption) {
        try {
            const prompt = MoonConfig.current.wheelPrompts?.resultInterpret || MoonConfig.defaults.wheelPrompts.resultInterpret;
            const userMsg = `转盘名称：${wheelName}，命运选择的结果是：「${resultOption}」。请给出有趣的解读。`;
            const result = await MoonAPI.chatSingle(prompt, userMsg, { thinking: false });
            return { success: true, content: MoonUtils.stripThinking(result.content) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
