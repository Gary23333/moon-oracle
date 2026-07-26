// 月影决策屋 - 历史记录（占位入口）

import { MoonConfig } from './common/config.js';
import { MoonEffects } from './common/effects.js';

document.addEventListener('DOMContentLoaded', () => {
    MoonConfig.init();
    MoonEffects.init();
    MoonEffects.createStars('starsContainer');
});
