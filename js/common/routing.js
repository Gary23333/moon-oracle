// 月影决策屋 - 按任务分级的模型路由
// 依据任务 key 解析出 provider / model / thinking / reasoningEffort，供各 AI 调用点统一使用。

import { MoonConfig } from './config.js';

/**
 * 解析某任务的模型路由。
 * @param {string} taskKey 任务键：reading | followup | generate | vision | quick | daily | interpret | detail
 * @param {{provider?:string, model?:string, thinking?:boolean, reasoningEffort?:string}} overrides 显式覆盖项
 * @returns {{ provider: string, model: string, thinking: boolean, reasoningEffort: string }}
 */
export function resolveTaskRoute(taskKey, overrides = {}) {
    const provider = overrides.provider ?? MoonConfig.get('provider');

    const model = overrides.model
        ?? MoonConfig.get('models')?.[taskKey]
        ?? MoonConfig.get('model');

    const thinking = overrides.thinking
        ?? MoonConfig.get('thinkingByTask')?.[taskKey]
        ?? MoonConfig.get('thinkingEnabled');

    const reasoningEffort = overrides.reasoningEffort ?? MoonConfig.get('thinkingEffort');

    return { provider, model, thinking, reasoningEffort };
}

export const MoonRouting = { resolveTaskRoute };

export default MoonRouting;
