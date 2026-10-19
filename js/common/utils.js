// 月影决策屋 - 工具函数

export const MoonUtils = {
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
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

    sanitize(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    formatText(text) {
        if (!text) return '';
        const escaped = this.sanitize(text);
        return escaped
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    },

    stripThinking(text) {
        if (!text) return '';
        return text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/^\s*\n/gm, '\n').trim();
    },

    // 当前活跃的打字动画控制器
    _activeTyping: null,

    async typeText(element, text, speed = 30) {
        // 取消上一次未完成的打字动画
        if (this._activeTyping) {
            this._activeTyping.cancel();
        }

        let cancelled = false;
        let intervalId = null;
        const controller = {
            cancel() {
                cancelled = true;
                if (intervalId) { clearInterval(intervalId); intervalId = null; }
            }
        };
        this._activeTyping = controller;

        element.innerHTML = '';
        const formatted = this.formatText(text);

        // 解析HTML节点，逐字符输出保留格式
        const temp = document.createElement('div');
        temp.innerHTML = formatted;

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
            intervalId = setInterval(() => {
                if (cancelled) {
                    clearInterval(intervalId);
                    element.innerHTML = formatted;
                    if (this._activeTyping === controller) this._activeTyping = null;
                    resolve();
                    return;
                }
                if (charIndex < charSpans.length) {
                    charSpans[charIndex].style.visibility = 'visible';
                    charIndex++;
                } else {
                    clearInterval(intervalId);
                    element.innerHTML = formatted;
                    if (this._activeTyping === controller) this._activeTyping = null;
                    resolve();
                }
            }, speed);
        });
    },

    /**
     * 创建流式渲染器：把增量 content / reasoning 累积并安全渲染到目标元素。
     * @param {HTMLElement|string|Function} target 目标元素、元素 id 或返回元素的 getter（支持延迟获取）
     * @param {{ showThinking?: boolean }} options
     * @returns {{ content:string, thinking:string, appendContent:(t:string)=>void, appendReasoning:(t:string)=>void, render:()=>void, finish:()=>{content:string,thinking:string}, cancel:()=>void }}
     */
    createStreamRenderer(target, options = {}) {
        const showThinking = options.showThinking === true;
        const self = this;

        const resolveEl = () => {
            if (typeof target === 'function') return target();
            if (typeof target === 'string') return document.getElementById(target);
            return target || null;
        };

        const renderer = {
            content: '',
            thinking: '',
            _finished: false,

            _autoScroll(el) {
                let node = el.parentElement;
                while (node) {
                    const style = window.getComputedStyle(node);
                    if (/(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
                        node.scrollTop = node.scrollHeight;
                        return;
                    }
                    node = node.parentElement;
                }
                if (document.documentElement.scrollHeight > window.innerHeight) {
                    window.scrollTo({ top: document.documentElement.scrollHeight });
                }
            },

            render() {
                const el = resolveEl();
                if (!el) return;

                let html = '';
                if (showThinking && this.thinking) {
                    html += `<div class="thinking-box"><strong>月影的思考过程：</strong><br>${self.formatText(this.thinking)}</div>`;
                    if (this.content) html += '<hr>';
                }
                html += self.formatText(this.content);
                // 始终整体重写，保证幂等、不重复渲染
                el.innerHTML = html;

                this._autoScroll(el);
            },

            appendContent(text) {
                if (!text) return;
                this.content += text;
                this.render();
            },

            appendReasoning(text) {
                if (!text) return;
                this.thinking += text;
                this.render();
            },

            finish() {
                this._finished = true;
                this.render();
                return { content: this.content, thinking: this.thinking };
            },

            cancel() {
                this._finished = true;
            }
        };

        return renderer;
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
