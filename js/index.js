// 月影决策屋 - 首页入口（抽取自原 index.html 内联脚本）

import { MoonConfig } from './common/config.js';
import { MoonAPI } from './common/api.js';
import { MoonUtils } from './common/utils.js';
import { MoonEffects } from './common/effects.js';

document.addEventListener('DOMContentLoaded', () => {
    MoonConfig.init();
    MoonEffects.init();
    MoonEffects.createStars('starsContainer');

    const configToggle = document.getElementById('configToggle');
    const configPanel = document.getElementById('configPanel');
    const configSave = document.getElementById('configSave');
    const configReset = document.getElementById('configReset');

    configToggle.addEventListener('click', () => configPanel.classList.toggle('active'));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') configPanel.classList.remove('active');
    });

    function loadConfigUI() {
        const c = MoonConfig.current;
        document.getElementById('cfgApiUrl').value = c.apiUrl || '';
        document.getElementById('cfgApiKey').value = c.apiKey || '';
        document.getElementById('cfgRememberApiKey').checked = c.rememberApiKey === true;
        document.getElementById('cfgModel').value = c.model || '';
        document.getElementById('cfgThinkingToggle').classList.toggle('active', c.thinkingEnabled);
        document.getElementById('cfgThinkingEffort').value = c.thinkingEffort || 'high';
        document.getElementById('cfgShowThinkingToggle').classList.toggle('active', c.showThinking);
        document.getElementById('cfgWheelAIToggle').classList.toggle('active', c.wheelResultAI);
        document.getElementById('cfgPersona').value = c.readerPersona || 'gentle';
        document.getElementById('cfgPromptGreeting').value = c.tarotPrompts?.greeting || '';
        document.getElementById('cfgPromptReading').value = c.tarotPrompts?.reading || '';
        document.getElementById('cfgPromptWheel').value = c.wheelPrompts?.generate || '';
        for (const id of ['cfgThinkingToggle', 'cfgShowThinkingToggle', 'cfgWheelAIToggle']) {
            const toggle = document.getElementById(id);
            toggle.setAttribute('aria-checked', String(toggle.classList.contains('active')));
        }
    }

    function setupToggle(id, key) {
        const el = document.getElementById(id);
        el.addEventListener('click', () => {
            el.classList.toggle('active');
            const isActive = el.classList.contains('active');
            el.setAttribute('aria-checked', isActive);
            MoonConfig.set(key, isActive);
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    }

    setupToggle('cfgThinkingToggle', 'thinkingEnabled');
    setupToggle('cfgShowThinkingToggle', 'showThinking');
    setupToggle('cfgWheelAIToggle', 'wheelResultAI');

    configSave.addEventListener('click', () => {
        let apiUrl;
        try {
            apiUrl = MoonAPI.validateApiUrl(document.getElementById('cfgApiUrl').value);
        } catch (error) {
            MoonUtils.showToast(error.message);
            return;
        }
        Object.assign(MoonConfig.current, {
            apiUrl,
            apiKey: document.getElementById('cfgApiKey').value.trim(),
            rememberApiKey: document.getElementById('cfgRememberApiKey').checked
        });
        MoonConfig.set('model', document.getElementById('cfgModel').value);
        MoonConfig.set('thinkingEffort', document.getElementById('cfgThinkingEffort').value);
        MoonConfig.set('readerPersona', document.getElementById('cfgPersona').value);
        MoonConfig.current.tarotPrompts = {
            ...MoonConfig.current.tarotPrompts,
            greeting: document.getElementById('cfgPromptGreeting').value,
            reading: document.getElementById('cfgPromptReading').value
        };
        MoonConfig.current.wheelPrompts = {
            ...MoonConfig.current.wheelPrompts,
            generate: document.getElementById('cfgPromptWheel').value
        };
        const saved = MoonConfig.save();
        if (saved) configPanel.classList.remove('active');
        MoonUtils.showToast(saved ? '配置已保存' : '浏览器存储不可用，配置仅本页生效；清除旧 Key 请检查浏览器网站数据');
    });

    document.getElementById('configClearKey').addEventListener('click', () => {
        const cleared = MoonConfig.clearApiKey();
        loadConfigUI();
        MoonUtils.showToast(cleared ? '已清除 Key' : '无法清除浏览器存储，请手动清除本网站数据');
    });

    configReset.addEventListener('click', () => {
        MoonConfig.reset();
        loadConfigUI();
        MoonUtils.showToast('配置已重置');
    });

    loadConfigUI();
});
