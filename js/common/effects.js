// 月影决策屋 - 视觉效果

const MoonEffects = {
    createStars(containerId, count = 150) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const minOpacity = Math.random() * 0.3 + 0.1;
            const maxOpacity = Math.random() * 0.5 + 0.5;
            
            star.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${x}%; top: ${y}%;
                --duration: ${duration}s;
                --min-opacity: ${minOpacity};
                --max-opacity: ${maxOpacity};
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(star);
        }
    },

    createParticleBurst(x, y, color = 'rgba(139,92,246,0.6)', count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px; top: ${y}px;
                width: 4px; height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particleBurst 0.6s ease-out forwards;
                --angle: ${(360 / count) * i}deg;
                --distance: ${50 + Math.random() * 50}px;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    },

    createFlash(color = 'rgba(139,92,246,0.2)') {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: radial-gradient(circle at center, ${color} 0%, transparent 70%);
            pointer-events: none; z-index: 9999;
            animation: flashFade 0.3s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    },

    addParticleStyles() {
        if (document.getElementById('moon-particle-styles')) return;
        const style = document.createElement('style');
        style.id = 'moon-particle-styles';
        style.textContent = `
            @keyframes particleBurst {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { 
                    transform: translate(
                        calc(cos(var(--angle)) * var(--distance)),
                        calc(sin(var(--angle)) * var(--distance))
                    ) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },

    init() {
        this.addParticleStyles();
    }
};
