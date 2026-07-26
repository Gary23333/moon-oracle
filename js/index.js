// 月影决策屋 - 首页入口（抽取自原 index.html 内联脚本）

import { MoonConfig } from './common/config.js';
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
        document.getElementById('cfgModel').value = c.model || '';
        document.getElementById('cfgThinkingToggle').classList.toggle('active', c.thinkingEnabled);
        document.getElementById('cfgThinkingEffort').value = c.thinkingEffort || 'high';
        document.getElementById('cfgShowThinkingToggle').classList.toggle('active', c.showThinking);
        document.getElementById('cfgWheelAIToggle').classList.toggle('active', c.wheelResultAI);
        document.getElementById('cfgSoundToggle').classList.toggle('active', c.soundEnabled);
        document.getElementById('cfgPromptGreeting').value = c.tarotPrompts?.greeting || '';
        document.getElementById('cfgPromptReading').value = c.tarotPrompts?.reading || '';
        document.getElementById('cfgPromptWheel').value = c.wheelPrompts?.generate || '';
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
    setupToggle('cfgSoundToggle', 'soundEnabled');

    configSave.addEventListener('click', () => {
        MoonConfig.set('apiUrl', document.getElementById('cfgApiUrl').value);
        MoonConfig.set('apiKey', document.getElementById('cfgApiKey').value);
        MoonConfig.set('model', document.getElementById('cfgModel').value);
        MoonConfig.set('thinkingEffort', document.getElementById('cfgThinkingEffort').value);
        MoonConfig.current.tarotPrompts = {
            ...MoonConfig.current.tarotPrompts,
            greeting: document.getElementById('cfgPromptGreeting').value,
            reading: document.getElementById('cfgPromptReading').value
        };
        MoonConfig.current.wheelPrompts = {
            ...MoonConfig.current.wheelPrompts,
            generate: document.getElementById('cfgPromptWheel').value
        };
        MoonConfig.save();
        configPanel.classList.remove('active');
        MoonUtils.showToast('配置已保存');
    });

    configReset.addEventListener('click', () => {
        MoonConfig.reset();
        loadConfigUI();
        MoonUtils.showToast('配置已重置');
    });

    loadConfigUI();
});
