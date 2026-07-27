import { MoonConfig } from '../common/config.js';
import { MoonUtils } from '../common/utils.js';
import { MoonEffects } from '../common/effects.js';
import { TAROT_IMAGE_FILES, TAROT_CARDS } from '../tarot/cards-data.js';
import { MoonHistory } from './store.js';

export const HistoryApp = {
    state: {
        currentFilter: 'all',
        records: [],
        selectedRecord: null,
        sharingRecord: null
    },

    typeConfig: {
        tarot: {
            label: '塔罗占卜',
            icon: '🔮',
            color: '#8b5cf6'
        },
        quick: {
            label: '快占',
            icon: '✨',
            color: '#f0d68a'
        },
        daily: {
            label: '每日塔罗',
            icon: '🌙',
            color: '#c4b5fd'
        }
    },

    init() {
        MoonConfig.init();
        MoonEffects.init();
        MoonEffects.createStars('starsContainer');
        this.loadRecords();
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.setFilter(tab.dataset.filter);
            });
        });

        const clearBtn = document.getElementById('clearAllBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.confirmClear());
        }

        const detailModal = document.getElementById('detailModal');
        if (detailModal) {
            detailModal.addEventListener('click', (e) => {
                if (e.target === detailModal) {
                    this.closeDetail();
                }
            });
        }

        const closeDetailBtn = document.getElementById('closeDetailBtn');
        if (closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => this.closeDetail());
        }

        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    this.closeShare();
                }
            });
        }

        const closeShareBtn = document.getElementById('closeShareBtn');
        if (closeShareBtn) {
            closeShareBtn.addEventListener('click', () => this.closeShare());
        }

        const downloadShareBtn = document.getElementById('downloadShareBtn');
        if (downloadShareBtn) {
            downloadShareBtn.addEventListener('click', () => this.downloadShareCard());
        }
    },

    loadRecords() {
        this.state.records = MoonHistory.getRecords();
        this.renderList();
    },

    setFilter(filter) {
        this.state.currentFilter = filter;

        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        this.renderList();
    },

    getFilteredRecords() {
        if (this.state.currentFilter === 'all') {
            return this.state.records;
        }
        return this.state.records.filter(r => r.type === this.state.currentFilter);
    },

    renderList() {
        const container = document.getElementById('recordsList');
        if (!container) return;

        const records = this.getFilteredRecords();

        if (records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📜</div>
                    <p class="empty-text">暂无占卜记录</p>
                    <p class="empty-hint">去首页进行一次占卜吧</p>
                </div>
            `;
            return;
        }

        container.innerHTML = records.map(record => this.renderRecordCard(record)).join('');

        document.querySelectorAll('.record-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                this.openDetail(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.deleteRecord(id);
            });
        });

        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.openShare(id);
            });
        });
    },

    renderRecordCard(record) {
        const config = this.typeConfig[record.type] || this.typeConfig.tarot;
        const timeStr = this.formatTime(record.timestamp);

        return `
            <div class="record-card" data-id="${record.id}">
                <div class="record-icon" style="background: ${config.color}20; color: ${config.color};">
                    ${config.icon}
                </div>
                <div class="record-info">
                    <div class="record-type">${config.label}</div>
                    <div class="record-summary">${MoonUtils.sanitize(record.summary)}</div>
                    <div class="record-time">${timeStr}</div>
                </div>
                <div class="record-actions">
                    <button class="share-btn" data-id="${record.id}" title="生成分享卡片">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                    <button class="delete-btn" data-id="${record.id}" title="删除记录">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    },

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - timestamp;

        if (diff < 60000) {
            return '刚刚';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}小时前`;
        } else if (diff < 604800000) {
            return `${Math.floor(diff / 86400000)}天前`;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');

        if (year === now.getFullYear()) {
            return `${month}-${day} ${hour}:${minute}`;
        }
        return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    deleteRecord(id) {
        if (!confirm('确定要删除这条记录吗？')) return;

        MoonHistory.deleteRecord(id);
        MoonUtils.showToast('记录已删除');
        this.loadRecords();
    },

    confirmClear() {
        const count = this.getFilteredRecords().length;
        if (count === 0) {
            MoonUtils.showToast('暂无记录可清空');
            return;
        }

        if (!confirm(`确定要清空全部${count}条记录吗？此操作不可恢复。`)) return;

        MoonHistory.clearRecords();
        MoonUtils.showToast('所有记录已清空');
        this.loadRecords();
    },

    openDetail(id) {
        const record = MoonHistory.getRecord(id);
        if (!record) return;

        this.state.selectedRecord = record;
        this.renderDetail(record);

        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeDetail() {
        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.state.selectedRecord = null;
    },

    renderDetail(record) {
        const content = document.getElementById('detailContent');
        if (!content) return;

        const config = this.typeConfig[record.type] || this.typeConfig.tarot;
        const timeStr = new Date(record.timestamp).toLocaleString('zh-CN');

        let detailHtml = '';

        switch (record.type) {
            case 'tarot':
                detailHtml = this.renderTarotDetail(record);
                break;
            case 'quick':
                detailHtml = this.renderQuickDetail(record);
                break;
            case 'daily':
                detailHtml = this.renderDailyDetail(record);
                break;
            default:
                detailHtml = `<p>${MoonUtils.formatText(record.summary)}</p>`;
        }

        content.innerHTML = `
            <div class="detail-header">
                <div class="detail-type" style="color: ${config.color};">
                    ${config.icon} ${config.label}
                </div>
                <div class="detail-time">${timeStr}</div>
            </div>
            <div class="detail-body">
                ${detailHtml}
            </div>
        `;
    },

    renderTarotDetail(record) {
        const data = record.data || {};
        const cards = data.revealedCards || [];
        const question = data.question || '';
        const reading = data.readingResult || '';
        const spreadName = data.spreadName || '';

        let cardsHtml = '';
        if (cards.length > 0) {
            cardsHtml = cards.map((card, index) => {
                const cardData = TAROT_CARDS.find(c => c.id === card.id);
                if (!cardData) return '';

                const imageUrl = MoonUtils.getTarotImageUrl(card.id, TAROT_IMAGE_FILES);
                const isReversed = card.orientation === '逆位';
                const position = data.spreadPositions ? data.spreadPositions[index] : '';

                return `
                    <div class="tarot-detail-card">
                        <div class="tarot-detail-image-wrap">
                            <img src="${imageUrl}" alt="${card.name}" class="${isReversed ? 'reversed' : ''}" loading="lazy">
                        </div>
                        <div class="tarot-detail-info">
                            <div class="tarot-detail-position">${position || `第${index + 1}张牌`}</div>
                            <div class="tarot-detail-name">${cardData.name}</div>
                            <div class="tarot-detail-orientation ${isReversed ? 'reversed' : ''}">${card.orientation}</div>
                            <div class="tarot-detail-meaning">${isReversed ? cardData.reversedMeaning : cardData.uprightMeaning}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        return `
            <div class="detail-section">
                <h3>🔮 问题</h3>
                <p>${MoonUtils.sanitize(question)}</p>
            </div>
            ${spreadName ? `
            <div class="detail-section">
                <h3>✨ 牌阵</h3>
                <p>${spreadName}</p>
            </div>` : ''}
            <div class="detail-section">
                <h3>🃏 牌面</h3>
                <div class="tarot-detail-cards">${cardsHtml}</div>
            </div>
            <div class="detail-section">
                <h3>📖 解读</h3>
                <div class="detail-reading">${MoonUtils.formatText(reading)}</div>
            </div>
        `;
    },

    renderQuickDetail(record) {
        const data = record.data || {};
        const question = data.question || '';
        const result = data.result || '';
        const comment = data.comment || '';

        return `
            <div class="detail-section">
                <h3>❓ 问题</h3>
                <p>${MoonUtils.sanitize(question)}</p>
            </div>
            <div class="detail-section">
                <h3>✨ 结果</h3>
                <p>${MoonUtils.sanitize(result)}</p>
            </div>
            <div class="detail-section">
                <h3>💬 简评</h3>
                <p>${MoonUtils.formatText(comment)}</p>
            </div>
        `;
    },

    renderDailyDetail(record) {
        const data = record.data || {};
        const card = data.card || {};
        const quote = data.quote || '';
        const streak = data.streak || 0;
        const date = data.date || '';

        const cardData = TAROT_CARDS.find(c => c.id === card.id);
        const imageUrl = card.id !== undefined ? MoonUtils.getTarotImageUrl(card.id, TAROT_IMAGE_FILES) : '';

        return `
            <div class="detail-section">
                <h3>📅 日期</h3>
                <p>${date || new Date(record.timestamp).toLocaleDateString('zh-CN')}</p>
            </div>
            ${streak > 0 ? `
            <div class="detail-section">
                <h3>🔥 连续打卡</h3>
                <p>${streak}天</p>
            </div>` : ''}
            <div class="detail-section">
                <h3>🌙 今日牌面</h3>
                ${cardData ? `
                <div class="daily-detail-card">
                    <div class="daily-detail-image-wrap">
                        <img src="${imageUrl}" alt="${cardData.name}" loading="lazy">
                    </div>
                    <div class="daily-detail-info">
                        <div class="daily-detail-name">${cardData.name}</div>
                        <div class="daily-detail-orientation">${card.orientation || '正位'}</div>
                    </div>
                </div>` : ''}
            </div>
            <div class="detail-section">
                <h3>💫 塔罗语录</h3>
                <div class="detail-quote">${MoonUtils.formatText(quote)}</div>
            </div>
        `;
    },

    openShare(id) {
        const record = MoonHistory.getRecord(id);
        if (!record) return;

        this.state.sharingRecord = record;

        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        setTimeout(() => this.generateShareCard(record), 100);
    },

    closeShare() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.state.sharingRecord = null;
    },

    generateShareCard(record) {
        const canvas = document.getElementById('shareCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = 600;
        const height = 800;
        canvas.width = width;
        canvas.height = height;

        this.drawShareCardBackground(ctx, width, height);
        this.drawShareCardContent(ctx, record, width, height);
    },

    drawShareCardBackground(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a0525');
        gradient.addColorStop(0.5, '#2d1b4e');
        gradient.addColorStop(1, '#12081f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#d4a843';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 1;
        ctx.strokeRect(28, 28, width - 56, height - 56);

        this.drawStars(ctx, width, height);
        this.drawMoon(ctx, width, height);
    },

    drawStars(ctx, width, height) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;

            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        this.drawStarShape(ctx, width - 80, 80, 12, 6);
        this.drawStarShape(ctx, 80, height - 80, 10, 5);
        this.drawStarShape(ctx, width - 100, height - 120, 8, 5);
    },

    drawStarShape(ctx, cx, cy, outerRadius, points) {
        ctx.beginPath();
        ctx.fillStyle = '#d4a843';
        ctx.globalAlpha = 0.6;

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : outerRadius / 2;
            const angle = (Math.PI / points) * i - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    },

    drawMoon(ctx, width, height) {
        ctx.beginPath();
        ctx.fillStyle = '#f0e68c';
        ctx.arc(width - 100, 100, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = '#1a0525';
        ctx.arc(width - 85, 95, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#daa520';
        ctx.shadowColor = '#daa520';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(width - 100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    },

    drawShareCardContent(ctx, record, width, height) {
        const config = this.typeConfig[record.type] || this.typeConfig.tarot;
        const timeStr = new Date(record.timestamp).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        ctx.textAlign = 'center';

        ctx.font = 'bold 28px "Cinzel Decorative", serif';
        ctx.fillStyle = '#d4a843';
        ctx.fillText('月影决策屋', width / 2, 80);

        ctx.font = '16px "Noto Serif SC", serif';
        ctx.fillStyle = '#a78bcd';
        ctx.fillText('MOON ORACLE', width / 2, 105);

        ctx.font = '20px "Noto Serif SC", serif';
        ctx.fillStyle = '#c4b5fd';
        ctx.fillText(timeStr, width / 2, 150);

        ctx.font = 'bold 24px "Noto Serif SC", serif';
        ctx.fillStyle = config.color;
        ctx.fillText(`${config.icon} ${config.label}`, width / 2, 200);

        ctx.fillStyle = '#f5f0ff';
        ctx.font = '20px "Noto Serif SC", serif';
        const summary = MoonUtils.sanitize(record.summary);
        this.wrapText(ctx, summary, width / 2, 250, width - 80, 30);

        this.drawCardPreview(ctx, record, width, height);

        ctx.fillStyle = '#a78bcd';
        ctx.font = '14px "Noto Serif SC", serif';
        ctx.fillText('✨ 在星辰与烛火之间 ✨', width / 2, height - 40);
    },

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, y);
    },

    drawCardPreview(ctx, record, width, height) {
        const data = record.data || {};
        let cardId = null;
        let orientation = '正位';

        if (record.type === 'tarot') {
            const cards = data.revealedCards || [];
            if (cards.length > 0) {
                cardId = cards[0].id;
                orientation = cards[0].orientation || '正位';
            }
        } else if (record.type === 'daily') {
            cardId = data.card?.id;
            orientation = data.card?.orientation || '正位';
        }

        if (cardId === null || cardId === undefined) return;

        const cardData = TAROT_CARDS.find(c => c.id === cardId);
        if (!cardData) return;

        const imageUrl = MoonUtils.getTarotImageUrl(cardId, TAROT_IMAGE_FILES);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.save();

            const cardWidth = 140;
            const cardHeight = 200;
            const cardX = (width - cardWidth) / 2;
            const cardY = height - 300;

            ctx.shadowColor = '#d4a843';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#1e1235';
            ctx.fillRect(cardX - 5, cardY - 5, cardWidth + 10, cardHeight + 10);

            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.rect(cardX, cardY, cardWidth, cardHeight);
            ctx.clip();

            if (orientation === '逆位') {
                ctx.translate(cardX + cardWidth / 2, cardY + cardHeight / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
            } else {
                ctx.drawImage(img, cardX, cardY, cardWidth, cardHeight);
            }

            ctx.restore();

            ctx.fillStyle = '#d4a843';
            ctx.font = 'bold 18px "Noto Serif SC", serif';
            ctx.fillText(cardData.name, width / 2, height - 80);

            ctx.fillStyle = '#c4b5fd';
            ctx.font = '14px "Noto Serif SC", serif';
            ctx.fillText(orientation, width / 2, height - 60);
        };
        img.onerror = () => {
            ctx.fillStyle = '#d4a843';
            ctx.font = '32px serif';
            ctx.fillText(cardData.name, width / 2, height - 100);
        };
        img.src = imageUrl;
    },

    downloadShareCard() {
        const canvas = document.getElementById('shareCanvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `moon-oracle-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        MoonUtils.showToast('分享卡片已下载');
    }
};

document.addEventListener('DOMContentLoaded', () => HistoryApp.init());