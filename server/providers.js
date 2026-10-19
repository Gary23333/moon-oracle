// 月影决策屋 - 厂商（provider）注册表
// 零依赖：仅使用 Node 内置能力（process.env），供 server/app.js 与前端共同使用。

/**
 * 内置厂商预设。
 * - deepseek：DeepSeek 官方 OpenAI 兼容端点。
 *   - deepseek-flash   → 原生多模态，支持视觉（Vision）。
 *   - deepseek-v4-pro  → 深度推理模型，不支持视觉。
 * - custom：用户自定义任意 OpenAI 兼容端点（baseUrl / model 由客户端提供）。
 */
export const PRESETS = [
    {
        id: 'deepseek',
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com',
        models: ['deepseek-flash', 'deepseek-v4-pro'],
        envKeyVar: 'DEEPSEEK_API_KEY',
        // 预设级默认视觉能力；实际能力按模型区分（见 visionModels）。
        supportsVision: true,
        // 仅这些模型具备视觉能力；deepseek-v4-pro 不在其中。
        visionModels: ['deepseek-flash']
    },
    {
        id: 'custom',
        name: '自定义（OpenAI 兼容）',
        baseUrl: '',
        models: [],
        envKeyVar: 'OPENAI_API_KEY',
        supportsVision: true,
        visionModels: null
    }
];

function stripTrailingSlash(url) {
    return typeof url === 'string' ? url.replace(/\/+$/, '') : url;
}

function resolveVision(preset, model) {
    if (model && Array.isArray(preset.visionModels)) {
        return preset.visionModels.includes(model);
    }
    return !!preset.supportsVision;
}

/**
 * 解析厂商信息。
 * @param {{ provider?: string, baseUrl?: string, apiKey?: string, model?: string }} input
 * @returns {{ id: string, baseUrl: string, apiKey: string, supportsVision: boolean, name: string, models: string[], envKeyVar: string|null }}
 * @throws {{ status: number, code: string, message: string }} 结构化错误
 */
export function resolveProvider({ provider, baseUrl, apiKey, model } = {}) {
    const id = provider || 'deepseek';
    const preset = PRESETS.find((p) => p.id === id) || null;

    const envKeyVar = preset ? preset.envKeyVar : 'OPENAI_API_KEY';
    const resolvedBaseUrl = stripTrailingSlash(baseUrl || (preset ? preset.baseUrl : ''));
    const supportsVision = preset ? resolveVision(preset, model) : true;

    // API Key 解析顺序：(1) 客户端自带 apiKey（BYOK 兜底）(2) 服务端环境变量。
    let resolvedApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
    if (!resolvedApiKey && envKeyVar) {
        resolvedApiKey = (process.env[envKeyVar] || '').trim();
    }

    if (!resolvedBaseUrl) {
        throw {
            status: 400,
            code: 'missing_base_url',
            message: `未配置 ${id} 的 API 地址（自定义厂商请填写 baseUrl）`
        };
    }

    if (!resolvedApiKey) {
        throw {
            status: 401,
            code: 'missing_api_key',
            message: `未配置 ${id} 的 API Key（请在服务端设置环境变量或在前端填写）`
        };
    }

    return {
        id,
        name: preset ? preset.name : id,
        baseUrl: resolvedBaseUrl,
        apiKey: resolvedApiKey,
        supportsVision,
        models: preset ? preset.models : [],
        envKeyVar
    };
}

/** 供前端/接口暴露的预设列表。 */
export const PROVIDER_PRESETS = PRESETS;
