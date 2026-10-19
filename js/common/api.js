// 月影决策屋 - 统一 API 客户端（经后端代理 POST /api/chat）
// 支持 provider/baseUrl 解析、SSE 流式增量解析、Vision 图文消息、超时与取消、轻量网络重试。

import { MoonConfig } from './config.js';

const DEFAULT_TIMEOUT = 120000;
const API_PATH = '/api/chat';
const MAX_NETWORK_RETRIES = 2;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 构造 Vision（图文混合）用户消息。
 * @param {string} text 文本部分
 * @param {string} imageDataUrl 图片 Data URL
 * @param {'auto'|'low'|'high'} detail 图片细节等级
 * @returns {{ role: string, content: Array }}
 */
export function buildVisionMessage(text, imageDataUrl, detail = 'auto') {
    return {
        role: 'user',
        content: [
            { type: 'text', text },
            { type: 'image_url', image_url: { url: imageDataUrl, detail } }
        ]
    };
}

export const MoonAPI = {
    _controller: null,
    _timeoutId: null,

    /** 取消当前进行中的请求并清理超时定时器。 */
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

    /** Vision 消息构造（对象方法形式）。 */
    buildVisionMessage,

    /** 解析有效超时时间（毫秒）：options > 配置 > 默认 120s。 */
    _resolveTimeout(options = {}) {
        const value = options.timeout ?? MoonConfig.get('timeout') ?? DEFAULT_TIMEOUT;
        const num = Number(value);
        return Number.isFinite(num) && num > 0 ? num : DEFAULT_TIMEOUT;
    },

    /**
     * 组装发往 /api/chat 的请求体。
     * provider/model 由 options 或配置解析；仅 custom 厂商附带 baseUrl；
     * apiKey 仅在配置中存在时附带（BYOK 兜底，服务端优先读取环境变量）；
     * thinking 仅在显式 true 时开启，显式 false 关闭，未指定则取配置默认。
     */
    _buildBody(messages, options = {}, stream = false) {
        const provider = options.provider ?? MoonConfig.get('provider') ?? 'deepseek';

        const body = {
            provider,
            model: options.model ?? MoonConfig.get('model') ?? 'deepseek-flash',
            messages,
            stream: stream === true,
            timeout: this._resolveTimeout(options)
        };

        if (provider === 'custom') {
            const baseUrl = options.baseUrl ?? MoonConfig.get('customBaseUrl');
            if (baseUrl) body.baseUrl = baseUrl;
        }

        const apiKey = MoonConfig.get('apiKey');
        if (apiKey) body.apiKey = apiKey;

        let thinking;
        if (options.thinking === true) {
            thinking = true;
        } else if (options.thinking === false) {
            thinking = false;
        } else {
            thinking = MoonConfig.get('thinkingEnabled') === true;
        }
        body.thinking = thinking;
        body.reasoning_effort = options.reasoningEffort ?? MoonConfig.get('thinkingEffort') ?? 'high';

        return body;
    },

    /** HTTP 状态码 → 友好中文提示（含代理新增状态码）。 */
    _getHttpErrorMessage(status) {
        switch (status) {
            case 400:
                return '请求参数有误，请检查模型与消息格式';
            case 401:
                return 'API Key 无效或已过期，请检查配置';
            case 403:
                return 'API 额度不足或权限受限，请检查账号状态';
            case 404:
                return 'API 接口不存在，请检查 API 地址配置';
            case 408:
                return '请求超时，请稍后重试';
            case 413:
                return '请求体过大，请压缩图片或缩短文本';
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

    /** 从错误响应中提取可读信息（优先代理返回的 error.message）。 */
    async _readErrorMessage(response) {
        let errorMsg = this._getHttpErrorMessage(response.status);
        try {
            const text = await response.text();
            if (text) {
                try {
                    const data = JSON.parse(text);
                    errorMsg = data.error?.message || data.message || errorMsg;
                } catch (e) {
                    errorMsg = text;
                }
            }
        } catch (e) {
            // 读取失败：回退到状态码映射
        }
        return errorMsg;
    },

    /**
     * 网络级失败有限重试；HTTP 响应（含 4xx/5xx）一律不重试，交由调用方处理。
     * 取消 / 超时（AbortError）立即抛出。
     */
    async _fetchWithRetry(url, init, maxRetries = MAX_NETWORK_RETRIES) {
        let attempt = 0;
        for (;;) {
            try {
                return await fetch(url, init);
            } catch (err) {
                if (err && err.name === 'AbortError') throw err;
                if (attempt >= maxRetries) throw err;
                attempt++;
                await delay(300 * attempt);
            }
        }
    },

    /**
     * 非流式对话：POST /api/chat（stream:false）。
     * @returns {Promise<{ content: string, thinking: string|null, usage: Object|undefined }>}
     */
    async chat(messages, options = {}) {
        const body = this._buildBody(messages, options, false);

        this.abort();
        this._controller = new AbortController();
        this._timeoutId = setTimeout(() => {
            if (this._controller) this._controller.abort();
        }, this._resolveTimeout(options));

        try {
            const response = await this._fetchWithRetry(API_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: this._controller.signal
            });

            if (!response.ok) {
                throw new Error(await this._readErrorMessage(response));
            }

            const data = await response.json();
            const message = data.choices?.[0]?.message;

            if (!message) {
                throw new Error('API 返回内容为空');
            }

            return {
                content: message.content || '',
                thinking: message.reasoning_content || null,
                usage: data.usage
            };
        } catch (err) {
            if (err && err.name === 'AbortError') {
                throw new Error('请求已取消或超时');
            }
            throw err;
        } finally {
            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }
            this._controller = null;
        }
    },

    /**
     * 流式对话：POST /api/chat（stream:true），解析 SSE 增量。
     * @param {Array} messages
     * @param {Object} options
     * @param {{ onDelta?: (text:string)=>void, onReasoning?: (text:string)=>void, onDone?: (result:Object)=>void }} callbacks
     * @returns {Promise<{ content: string, thinking: string|null, usage: Object|null }>}
     */
    async streamChat(messages, options = {}, callbacks = {}) {
        const body = this._buildBody(messages, options, true);

        this.abort();
        this._controller = new AbortController();
        this._timeoutId = setTimeout(() => {
            if (this._controller) this._controller.abort();
        }, this._resolveTimeout(options));

        let content = '';
        let thinking = '';
        let usage = null;

        try {
            const response = await this._fetchWithRetry(API_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: this._controller.signal
            });

            // 非 OK：在进入流式读取前先行处理
            if (!response.ok) {
                throw new Error(await this._readErrorMessage(response));
            }
            if (!response.body) {
                throw new Error('响应不支持流式读取');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let finished = false;

            while (!finished) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                let nlIndex;
                while ((nlIndex = buffer.indexOf('\n')) >= 0) {
                    let line = buffer.slice(0, nlIndex);
                    buffer = buffer.slice(nlIndex + 1);
                    if (line.endsWith('\r')) line = line.slice(0, -1);
                    if (!line || !line.startsWith('data:')) continue;

                    const payload = line.slice('data:'.length).trim();
                    if (payload === '[DONE]') {
                        finished = true;
                        break;
                    }
                    if (!payload) continue;

                    let chunk;
                    try {
                        chunk = JSON.parse(payload);
                    } catch (e) {
                        continue; // 忽略无法解析的分片
                    }

                    const delta = chunk.choices?.[0]?.delta;
                    if (delta) {
                        if (typeof delta.content === 'string' && delta.content) {
                            content += delta.content;
                            callbacks.onDelta?.(delta.content);
                        }
                        if (typeof delta.reasoning_content === 'string' && delta.reasoning_content) {
                            thinking += delta.reasoning_content;
                            callbacks.onReasoning?.(delta.reasoning_content);
                        }
                    }
                    if (chunk.usage) usage = chunk.usage;
                }
            }

            const result = { content, thinking: thinking || null, usage };
            callbacks.onDone?.(result);
            return result;
        } catch (err) {
            if (err && err.name === 'AbortError') {
                throw new Error('请求已取消或超时');
            }
            throw err;
        } finally {
            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }
            this._controller = null;
        }
    },

    /** 单轮对话：system + user（签名保持向后兼容）。 */
    async chatSingle(systemPrompt, userMessage, options = {}) {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ];
        return this.chat(messages, options);
    },

    /** 多轮对话（签名保持向后兼容）。 */
    async chatWithHistory(messages, options = {}) {
        return this.chat(messages, options);
    }
};
