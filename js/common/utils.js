// 月影决策屋 - 工具函数

const MoonUtils = {
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    showLoading(text = '月影正在为你占卜...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const textEl = overlay.querySelector('.loading-text');
            if (textEl) textEl.textContent = text;
            overlay.classList.add('active');
        }
    },

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    formatText(text) {
        if (!text) return '';
        const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return escaped
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    },

    stripThinking(text) {
        if (!text) return '';
        let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
        cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
        return cleaned.replace(/^\s*\n/gm, '\n').trim();
    },

    async typeText(element, text, speed = 30) {
        element.innerHTML = '';
        const formatted = this.formatText(text);
        
        // 解析HTML节点，逐字符输出保留格式
        const temp = document.createElement('div');
        temp.innerHTML = formatted;
        
        const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        
        // 清空目标元素，复制HTML结构
        element.innerHTML = formatted;
        // 隐藏所有文本内容
        const allText = element.querySelectorAll('*');
        element.innerHTML = '';
        
        // 重建结构，文本节点用span包裹用于逐字显示
        function cloneWithSpans(sourceNode, targetParent) {
            for (const child of sourceNode.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement('span');
                    span.className = 'typing-char';
                    span.style.visibility = 'hidden';
                    span.textContent = child.textContent;
                    targetParent.appendChild(span);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const clone = child.cloneNode(false);
                    targetParent.appendChild(clone);
                    cloneWithSpans(child, clone);
                }
            }
        }
        cloneWithSpans(temp, element);
        
        const charSpans = element.querySelectorAll('.typing-char');
        let charIndex = 0;
        
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (charIndex < charSpans.length) {
                    const span = charSpans[charIndex];
                    // 显示整个文本节点（一个span可能包含多个字符）
                    span.style.visibility = 'visible';
                    charIndex++;
                } else {
                    clearInterval(interval);
                    // 清理：移除临时span，恢复原始HTML
                    element.innerHTML = formatted;
                    resolve();
                }
            }, speed);
        });
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    getRandomOrientation() {
        return Math.random() < 0.55 ? '正位' : '逆位';
    },

    getTarotImageUrl(cardId, imageFiles) {
        const fileName = imageFiles[cardId];
        if (!fileName) return '';
        return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=500`;
    }
};
