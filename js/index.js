// 月影决策屋 - 首页入口（抽取自原 index.html 内联脚本）

import { MoonConfig } from './common/config.js';
import { MoonEffects } from './common/effects.js';

document.addEventListener('DOMContentLoaded', () => {
    MoonConfig.init();
    MoonEffects.init();
    MoonEffects.createStars('starsContainer');
});
