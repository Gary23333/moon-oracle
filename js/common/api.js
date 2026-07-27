// 月影决策屋 - DeepSeek API 封装

import { MoonConfig } from './config.js';

export const MoonAPI = {
    _controller: null,
    _timeoutId: null,

    abort() {
        if (this._controller) {
            this._controller.abort();
            this._controller = null;
        }
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    },

    async chat(messages, options = {}) {
        const config = MoonConfig.current;
        if (!config.apiKey) {
            throw new Error('请先配置 API Key');
        }

        this.abort();
        this._controller = new AbortController();
        this._timeoutId = setTimeout(() => this._controller.abort(), options.timeout || 120000);

        const body = {
            model: options.model || config.model,
            messages: messages,
            stream: false
        };

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

            clearTimeout(this._timeoutId);
            this._timeoutId = null;

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = this._getHttpErrorMessage(response.status);
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
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
            if (err.name === 'AbortError') {
                throw new Error('请求已取消或超时');
            }
            throw err;
        }
    },

    _getHttpErrorMessage(status) {
        switch (status) {
            case 401:
                return 'API Key 无效或已过期，请检查配置';
            case 403:
                return 'API 额度不足或权限受限，请检查账号状态';
            case 404:
                return 'API 接口不存在，请检查 API 地址配置';
            case 429:
                return '请求过于频繁，请稍后重试';
            case 500:
                return '服务端错误，请稍后重试';
            case 502:
            case 503:
            case 504:
                return '服务暂不可用，请稍后重试';
            default:
                return `HTTP ${status} 错误`;
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
