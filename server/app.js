// 月影决策屋 - 框架无关的请求处理器
// 仅依赖 Node 内置模块与全局 fetch，供 server/index.js（生产）与 vite.config.js（开发）复用。

import { resolveProvider, PRESETS } from './providers.js';

const KEY_MASK = '***';
const MAX_BODY_BYTES = 25 * 1024 * 1024;

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

/** 统一 JSON 响应。 */
export function sendJson(res, status, payload) {
    if (res.headersSent) {
        if (!res.writableEnded) res.end();
        return;
    }
    const body = JSON.stringify(payload);
    setCors(res);
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
}

/** 统一错误包装：{ error: { message, code? } }。 */
export function sendError(res, status, message, code) {
    const error = { message };
    if (code) error.code = code;
    sendJson(res, status, { error });
}

function friendlyMessage(status) {
    switch (status) {
        case 400: return '上游拒绝了请求（参数错误），请检查模型与消息格式';
        case 401: return 'API Key 无效或已过期，请检查配置';
        case 403: return 'API 额度不足或权限受限，请检查账号状态';
        case 404: return 'API 接口不存在，请检查 API 地址配置';
        case 408: return '上游请求超时，请稍后重试';
        case 429: return '请求过于频繁，请稍后重试';
        default:
            if (status >= 500) return '上游服务暂不可用，请稍后重试';
            return `上游返回 HTTP ${status} 错误`;
    }
}

/** 防止意外在错误信息中泄露密钥。 */
function sanitize(text, apiKey) {
    if (text == null) return '';
    let out = String(text);
    if (apiKey && apiKey.length >= 4) {
        out = out.split(apiKey).join(KEY_MASK);
    }
    return out;
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                reject(new Error('请求体过大'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

async function _handleChat(req, res) {
    if (req.method !== 'POST') {
        sendError(res, 405, '仅支持 POST 请求', 'method_not_allowed');
        return;
    }

    let raw;
    try {
        raw = await readBody(req);
    } catch (err) {
        sendError(res, 413, '请求体读取失败或过大', 'bad_request');
        return;
    }

    let body;
    try {
        body = raw ? JSON.parse(raw) : {};
    } catch (err) {
        sendError(res, 400, '请求体不是合法的 JSON', 'invalid_json');
        return;
    }
    body = body || {};

    const { provider, baseUrl, apiKey, model, messages, stream, thinking, reasoning_effort, timeout } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
        sendError(res, 400, '缺少 messages 或格式不正确', 'invalid_messages');
        return;
    }

    let resolved;
    try {
        resolved = resolveProvider({ provider, baseUrl, apiKey, model });
    } catch (err) {
        if (err && typeof err === 'object' && err.status) {
            sendError(res, err.status, err.message, err.code);
            return;
        }
        throw err;
    }

    const preset = PRESETS.find((p) => p.id === resolved.id);
    const upstreamModel = model || (preset && preset.models[0]) || '';
    if (!upstreamModel) {
        sendError(res, 400, '缺少 model', 'missing_model');
        return;
    }

    // 组装上游请求体：仅在 thinking === true 时附加思考参数。
    const upstreamBody = {
        model: upstreamModel,
        messages,
        stream: stream === true
    };
    if (thinking === true) {
        upstreamBody.thinking = { type: 'enabled' };
        upstreamBody.reasoning_effort = reasoning_effort || 'high';
    }

    const upstreamUrl = `${resolved.baseUrl}/chat/completions`;
    const controller = new AbortController();
    let timedOut = false;
    let timer = null;
    const timeoutMs = Number(timeout);
    if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
        timer = setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, timeoutMs);
    }

    // 客户端断开时取消上游请求。
    const onClientClose = () => {
        if (!res.writableEnded) controller.abort();
    };
    res.on('close', onClientClose);

    let upstream;
    try {
        upstream = await fetch(upstreamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resolved.apiKey}`
            },
            body: JSON.stringify(upstreamBody),
            signal: controller.signal
        });
    } catch (err) {
        if (timer) clearTimeout(timer);
        res.off('close', onClientClose);
        if (err && (err.name === 'AbortError' || timedOut)) {
            sendError(res, 504, '上游请求超时或已取消', 'upstream_timeout');
        } else {
            sendError(res, 502, `无法连接上游服务（${resolved.baseUrl}），请检查网络或 API 地址`, 'upstream_unreachable');
        }
        return;
    }

    // 上游返回错误：读取 body 后映射为友好中文提示，绝不泄露密钥。
    if (!upstream.ok) {
        if (timer) clearTimeout(timer);
        res.off('close', onClientClose);
        try {
            await upstream.text();
        } catch (err) { /* 忽略：仅为了排空 body */ }
        sendError(res, upstream.status, friendlyMessage(upstream.status), 'upstream_error');
        return;
    }

    // 流式：SSE 原样透传上游分片。
    if (stream === true) {
        setCors(res);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') res.flushHeaders();

        const reader = upstream.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const ok = res.write(Buffer.from(value));
                if (!ok) {
                    await new Promise((resolve) => res.once('drain', resolve));
                }
            }
        } catch (err) {
            // 客户端断开或上游中断：静默结束。
        } finally {
            if (timer) clearTimeout(timer);
            res.off('close', onClientClose);
            try { reader.releaseLock(); } catch (e) { /* noop */ }
            if (!res.writableEnded) res.end();
        }
        return;
    }

    // 非流式：原样透传上游 JSON。
    let text;
    try {
        text = await upstream.text();
    } catch (err) {
        if (timer) clearTimeout(timer);
        res.off('close', onClientClose);
        sendError(res, 502, '读取上游响应失败', 'upstream_read_error');
        return;
    }
    if (timer) clearTimeout(timer);
    res.off('close', onClientClose);

    if (res.headersSent) {
        if (!res.writableEnded) res.end();
        return;
    }
    setCors(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(text));
    res.end(text);
}

/** 对外入口：包一层 try/catch，任何意外都返回 500 JSON。 */
export async function handleChat(req, res) {
    try {
        await _handleChat(req, res);
    } catch (err) {
        const message = err && err.message ? sanitize(err.message, null) : '服务器内部错误';
        sendError(res, 500, `服务器内部错误：${message}`, 'internal_error');
    }
}

export { sanitize, friendlyMessage };
