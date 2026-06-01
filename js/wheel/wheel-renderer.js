// 月影决策屋 - Canvas 转盘渲染引擎

class WheelRenderer {
    constructor(canvas, options, weights = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = options;
        this.weights = weights || options.map(() => 1);
        this.rotation = 0;
        this.isSpinning = false;
        this.onResult = null;
        
        this.colors = [
            '#2d1b4e','#4a2d7a','#6b3fa0','#8b5cf6',
            '#1a0e2e','#3b1f6e','#5b3fb0','#7b4fd6',
            '#3d2b5e','#5a3d8a','#7b5fb0','#9b6fe6'
        ];
        
        this.resize();
        this.draw();
    }

    resize() {
        const size = Math.min(this.canvas.parentElement.clientWidth - 40, 400);
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = size / 2 - 20;
    }

    draw() {
        const { ctx, centerX, centerY, radius, options, weights } = this;
        if (options.length === 0) return;

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 外圈光晕
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(212,168,67,0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 绘制扇形（支持权重）
        let currentAngle = this.rotation;
        options.forEach((option, i) => {
            const sliceAngle = (weights[i] / totalWeight) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.fillStyle = this.colors[i % this.colors.length];
            ctx.fill();
            ctx.strokeStyle = 'rgba(212,168,67,0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 文字
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.fillStyle = '#f5f0ff';
            ctx.font = `${Math.max(10, 14 - options.length / 2)}px "Noto Serif SC"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textRadius = radius * 0.65;
            ctx.fillText(option, textRadius, 0);
            ctx.restore();

            currentAngle = endAngle;
        });

        // 中心圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
        gradient.addColorStop(0, '#f0d68a');
        gradient.addColorStop(1, '#b8860b');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0a0612';
        ctx.font = 'bold 14px "Noto Serif SC"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('转', centerX, centerY);

        this.drawPointer();
    }

    drawPointer() {
        const { ctx, centerX } = this;
        const pointerY = 15;
        
        ctx.beginPath();
        ctx.moveTo(centerX, pointerY);
        ctx.lineTo(centerX - 12, pointerY - 20);
        ctx.lineTo(centerX + 12, pointerY - 20);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(centerX, pointerY - 20, centerX, pointerY);
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(1, '#b8860b');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    spin() {
        if (this.isSpinning || this.options.length === 0) return;
        this.isSpinning = true;

        const targetRotation = Math.random() * Math.PI * 2 + Math.PI * 6;
        const duration = 4000 + Math.random() * 1000;
        const startTime = Date.now();
        const startRotation = this.rotation;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            this.rotation = startRotation + targetRotation * eased;
            this.draw();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                const result = this.getResult();
                if (this.onResult) this.onResult(result);
            }
        };

        requestAnimationFrame(animate);
    }

    getResult() {
        const { options, weights, rotation } = this;
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        
        // 指针在顶部（12点钟方向）
        let pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

        let currentAngle = 0;
        for (let i = 0; i < options.length; i++) {
            const sliceAngle = (weights[i] / totalWeight) * 2 * Math.PI;
            if (pointerAngle >= currentAngle && pointerAngle < currentAngle + sliceAngle) {
                return { option: options[i], index: i };
            }
            currentAngle += sliceAngle;
        }

        return { option: options[0], index: 0 };
    }

    setOptions(options, weights = null) {
        this.options = options;
        this.weights = weights || options.map(() => 1);
        this.rotation = 0;
        this.draw();
    }
}
