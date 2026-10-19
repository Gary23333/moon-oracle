// 月影决策屋 - 通用配置面板组件（可复用于全部页面）
// 用法：在任意页面引入 <script type="module" src="/js/common/config-panel.js"></script>
// 组件会在 DOMContentLoaded 时自动挂载；也可手动调用 MountConfigPanel()。
// 复用 css/base.css 中已有的 .config-* 样式类。

import { MoonConfig } from './config.js';
import { MoonUtils } from './utils.js';

const PANEL_ID = 'configPanel';
const TOGGLE_ID = 'configToggle';

/** 确保配置已初始化（current 为空时加载）。 */
function ensureConfig() {
    if (!MoonConfig.current || Object.keys(MoonConfig.current).length === 0) {
        MoonConfig.init();
    }
}

/** 构建面板 HTML 字符串（复用 base.css 已有类名）。 */
function buildPanelHTML() {
    const providerOptions = MoonConfig.providers
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join('');

    return `
        <h3>⚙️ 月影决策屋配置</h3>
        <div class="config-section">
            <div class="config-section-title">LLM 配置</div>
            <div class="config-field">
                <label>厂商</label>
                <select id="cfgProvider">${providerOptions}</select>
            </div>
            <div class="config-field">
                <label>模型</label>
                <select id="cfgModelSelect"></select>
                <input type="text" id="cfgModelCustom" placeholder="自定义模型名称，如 gpt-4o" style="display:none;">
            </div>
            <div class="config-field" id="cfgCustomBaseUrlField" style="display:none;">
                <label>自定义 Base URL</label>
                <input type="text" id="cfgCustomBaseUrl" placeholder="https://your-endpoint/v1">
            </div>
            <div class="config-field">
                <label>API Key（可选，本地 BYOK 兜底）</label>
                <input type="password" id="cfgApiKey" placeholder="sk-...">
            </div>
        </div>
        <div class="config-section">
            <div class="config-section-title">思考模式</div>
            <div class="config-field">
                <div class="toggle-row">
                    <label>启用思考模式</label>
                    <div class="toggle-switch" id="cfgThinkingToggle" role="switch" aria-checked="false" tabindex="0"></div>
                </div>
            </div>
            <div class="config-field">
                <label>思考强度</label>
                <select id="cfgThinkingEffort">
                    <option value="high">high - 标准</option>
                    <option value="max">max - 最强</option>
                </select>
            </div>
            <div class="config-field">
                <div class="toggle-row">
                    <label>显示思考过程</label>
                    <div class="toggle-switch" id="cfgShowThinkingToggle" role="switch" aria-checked="false" tabindex="0"></div>
                </div>
            </div>
            <div class="config-field">
                <div class="toggle-row">
                    <label>流式输出</label>
                    <div class="toggle-switch" id="cfgStreamingToggle" role="switch" aria-checked="false" tabindex="0"></div>
                </div>
            </div>
        </div>
        <div class="config-section">
            <div class="config-section-title">思考分级</div>
            <div class="config-field">
                <div class="toggle-row">
                    <label>塔罗解读/追问思考</label>
                    <div class="toggle-switch" id="cfgThinkReading" role="switch" aria-checked="false" tabindex="0"></div>
                </div>
            </div>
        </div>
        <div class="config-section">
            <div class="config-section-title">功能开关</div>
            <div class="config-field">
                <div class="toggle-row">
                    <label>转盘结果AI解读</label>
                    <div class="toggle-switch" id="cfgWheelAIToggle" role="switch" aria-checked="false" tabindex="0"></div>
                </div>
            </div>
        </div>
        <div class="config-section">
            <div class="config-section-title">解牌人格</div>
            <div class="config-field">
                <label>选择解牌师人格</label>
                <select id="cfgPersona">
                    <option value="serious">🔮 严肃智者 - 严谨、专业、深度分析</option>
                    <option value="gentle">💫 温柔疗愈 - 温暖、鼓励、安抚（默认）</option>
                    <option value="blunt">🔥 毒舌好友 - 幽默、直白、一针见血</option>
                </select>
            </div>
        </div>
        <div class="config-section">
            <div class="config-section-title">系统提示词</div>
            <div class="config-field">
                <label>塔罗问候提示词</label>
                <textarea id="cfgPromptGreeting" rows="3"></textarea>
            </div>
            <div class="config-field">
                <label>塔罗解读提示词</label>
                <textarea id="cfgPromptReading" rows="4"></textarea>
            </div>
            <div class="config-field">
                <label>转盘生成提示词</label>
                <textarea id="cfgPromptWheel" rows="3"></textarea>
            </div>
        </div>
        <button class="config-btn" id="configSave">保存配置</button>
        <button class="config-btn config-btn-secondary" id="configReset">重置默认</button>
    `;
}

/**
 * 挂载配置面板（幂等：若已存在则不做任何事）。
 * @returns {HTMLElement|null} 已挂载/新建的面板元素，幂等跳过时返回 null。
 */
export function MountConfigPanel() {
    if (document.getElementById(PANEL_ID) || document.getElementById(TOGGLE_ID)) {
        return null; // 幂等：已挂载则跳过
    }

    ensureConfig();

    // 齿轮按钮
    const toggle = document.createElement('div');
    toggle.className = 'config-toggle';
    toggle.id = TOGGLE_ID;
    toggle.title = '系统配置';
    toggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
    </svg>`;

    // 面板容器
    const panel = document.createElement('div');
    panel.className = 'config-panel';
    panel.id = PANEL_ID;
    panel.innerHTML = buildPanelHTML();

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    const $ = (id) => document.getElementById(id);

    const cfgProvider = $('cfgProvider');
    const cfgModelSelect = $('cfgModelSelect');
    const cfgModelCustom = $('cfgModelCustom');
    const cfgCustomBaseUrlField = $('cfgCustomBaseUrlField');
    const cfgCustomBaseUrl = $('cfgCustomBaseUrl');
    const cfgApiKey = $('cfgApiKey');
    const cfgThinkingEffort = $('cfgThinkingEffort');
    const cfgPersona = $('cfgPersona');
    const cfgPromptGreeting = $('cfgPromptGreeting');
    const cfgPromptReading = $('cfgPromptReading');
    const cfgPromptWheel = $('cfgPromptWheel');

    /** 直接设置开关视觉状态。 */
    function setToggle(id, active) {
        const el = $(id);
        if (!el) return;
        el.classList.toggle('active', active);
        el.setAttribute('aria-checked', String(active));
    }

    /** 根据当前厂商刷新模型下拉与自定义字段的可见性。 */
    function refreshProviderFields() {
        if (!cfgProvider) return;
        const provider = cfgProvider.value;
        const isCustom = provider === 'custom';

        // 模型下拉选项
        const models = MoonConfig.getModelsFor(provider);
        cfgModelSelect.innerHTML = models
            .map(m => `<option value="${m}">${m}</option>`)
            .join('');

        // 自定义厂商：显示文本输入 + Base URL，隐藏下拉
        cfgModelSelect.style.display = isCustom ? 'none' : '';
        cfgModelCustom.style.display = isCustom ? '' : 'none';
        cfgCustomBaseUrlField.style.display = isCustom ? '' : 'none';
    }

    /** 从配置回填 UI。 */
    function loadConfigUI() {
        const c = MoonConfig.current || {};
        cfgProvider.value = c.provider || 'deepseek';
        refreshProviderFields();

        if (cfgProvider.value === 'custom') {
            cfgModelCustom.value = c.model || '';
        } else {
            cfgModelSelect.value = c.model || '';
        }
        cfgCustomBaseUrl.value = c.customBaseUrl || '';
        cfgApiKey.value = c.apiKey || '';
        cfgThinkingEffort.value = c.thinkingEffort || 'high';
        cfgPersona.value = c.readerPersona || 'gentle';

        setToggle('cfgThinkingToggle', c.thinkingEnabled === true);
        setToggle('cfgShowThinkingToggle', c.showThinking === true);
        setToggle('cfgStreamingToggle', c.streaming === true);
        setToggle('cfgWheelAIToggle', c.wheelResultAI === true);
        setToggle('cfgThinkReading', c.thinkingByTask?.reading === true);

        cfgPromptGreeting.value = c.tarotPrompts?.greeting || '';
        cfgPromptReading.value = c.tarotPrompts?.reading || '';
        cfgPromptWheel.value = c.wheelPrompts?.generate || '';
    }

    /** 绑定开关：点击 + Enter/Space 切换，切换后回调。 */
    function setupToggle(id, onChange) {
        const el = $(id);
        if (!el) return;
        const handleToggle = () => {
            el.classList.toggle('active');
            const isActive = el.classList.contains('active');
            el.setAttribute('aria-checked', String(isActive));
            onChange(isActive);
        };
        el.addEventListener('click', handleToggle);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    }

    // 顶层布尔配置：切换即持久化
    setupToggle('cfgThinkingToggle', v => MoonConfig.set('thinkingEnabled', v));
    setupToggle('cfgShowThinkingToggle', v => MoonConfig.set('showThinking', v));
    setupToggle('cfgStreamingToggle', v => MoonConfig.set('streaming', v));
    setupToggle('cfgWheelAIToggle', v => MoonConfig.set('wheelResultAI', v));

    // 思考分级：一个开关同时控制解读与追问
    setupToggle('cfgThinkReading', (v) => {
        MoonConfig.current.thinkingByTask = {
            ...MoonConfig.current.thinkingByTask,
            reading: v,
            followup: v
        };
        MoonConfig.save();
    });

    // 厂商切换：刷新模型选项与可见性
    cfgProvider.addEventListener('change', refreshProviderFields);

    // 打开 / 关闭面板
    toggle.addEventListener('click', () => panel.classList.toggle('active'));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') panel.classList.remove('active');
    });

    // 保存
    $('configSave').addEventListener('click', () => {
        const provider = cfgProvider.value;
        MoonConfig.set('provider', provider);
        MoonConfig.set('model', provider === 'custom' ? cfgModelCustom.value : cfgModelSelect.value);
        MoonConfig.set('customBaseUrl', cfgCustomBaseUrl.value);
        MoonConfig.set('apiKey', cfgApiKey.value);
        MoonConfig.set('thinkingEffort', cfgThinkingEffort.value);
        MoonConfig.set('readerPersona', cfgPersona.value);

        MoonConfig.current.tarotPrompts = {
            ...MoonConfig.current.tarotPrompts,
            greeting: cfgPromptGreeting.value,
            reading: cfgPromptReading.value
        };
        MoonConfig.current.wheelPrompts = {
            ...MoonConfig.current.wheelPrompts,
            generate: cfgPromptWheel.value
        };
        MoonConfig.save();

        panel.classList.remove('active');
        MoonUtils.showToast('配置已保存');
    });

    // 重置
    $('configReset').addEventListener('click', () => {
        MoonConfig.reset();
        loadConfigUI();
        MoonUtils.showToast('配置已重置');
    });

    loadConfigUI();
    return panel;
}

// 自挂载：页面只需引入脚本即可
document.addEventListener('DOMContentLoaded', MountConfigPanel);

export default MountConfigPanel;
