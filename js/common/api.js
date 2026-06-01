// 月影决策屋 - DeepSeek API 封装

const MoonAPI = {
    _controller: null,

    abort() {
        if (this._controller) {
            this._controller.abort();
            this._controller = null;
        }
    },

    async chat(messages, options = {}) {
        const config = MoonConfig.current;
        if (!config.apiKey) {
            throw new Error('请先配置 API Key');
        }

        this.abort();
        this._controller = new AbortController();
        const timeoutId = setTimeout(() => this._controller.abort(), options.timeout || 120000);

        const body = {
            model: options.model || config.model,
            messages: messages,
            stream: false
        };

        // 思考模式配置（注意：思考模式不支持 temperature/top_p 等参数）
        if (options.thinking !== false && config.thinkingEnabled) {
            body.thinking = { type: 'enabled' };
            body.reasoning_effort = options.reasoningEffort || config.thinkingEffort || 'high';
        }

        try {
            const response = await fetch(`${config.apiUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify(body),
                signal: this._controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = `HTTP ${response.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMsg = errorData.error?.message || errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = errorText || errorMsg;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            const choice = data.choices?.[0]?.message;

            if (!choice) {
                throw new Error('API 返回内容为空');
            }

            return {
                content: choice.content || '',
                thinking: choice.reasoning_content || null,
                usage: data.usage
            };
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error('请求已取消或超时');
            }
            throw err;
        }
    },

    async chatSingle(systemPrompt, userMessage, options = {}) {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ];
        return this.chat(messages, options);
    },

    async chatWithHistory(messages, options = {}) {
        return this.chat(messages, options);
    }
};
