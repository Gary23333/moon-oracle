import { MoonConfig } from '../common/config.js';
import { MoonAPI } from '../common/api.js';
import { MoonUtils } from '../common/utils.js';
import { MoonEffects } from '../common/effects.js';
import { TAROT_IMAGE_FILES, getFullDeck } from '../tarot/cards-data.js';
import { MoonHistory } from '../history/store.js';
import { getQuoteByDate } from './quotes.js';

const STORAGE_KEY = 'moon_oracle_daily';

export const DailyTarotApp = {
    state: {
        today: '',
        hasDrawn: false,
        card: null,
        streak: 1,
        maxStreak: 1,
        lastDrawDate: '',
        reading: '',
        isDrawing: false,
        aiReading: ''
    },

    init() {
        MoonConfig.init();
        MoonEffects.init();
        MoonEffects.createStars('starsContainer');
        this.loadDailyData();
        this.bindEvents();
        this.render();
    },

    loadDailyData() {
        const today = this.getTodayString();
        this.state.today = today;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.updateStreak(data.lastDrawDate);
                if (data.date === today) {
                    this.state.hasDrawn = true;
                    this.state.card = data.card;
                    this.state.reading = data.reading || '';
                    this.state.aiReading = data.aiReading || '';
                }
            } catch (e) {
                console.warn('每日塔罗数据解析失败:', e.message);
            }
        }
    },

    updateStreak(lastDate) {
        const today = this.state.today;
        if (!lastDate) {
            this.state.streak = 1;
            this.state.lastDrawDate = '';
            return;
        }

        const todayDate = new Date(today);
        const lastDateObj = new Date(lastDate);
        const diffDays = Math.floor((todayDate - lastDateObj) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            this.state.streak = this.state.streak;
        } else if (diffDays === 1) {
            this.state.streak = (this.state.streak || 1) + 1;
        } else {
            this.state.streak = 1;
        }

        this.state.lastDrawDate = lastDate;
        if (this.state.streak > this.state.maxStreak) {
            this.state.maxStreak = this.state.streak;
        }
    },

    getTodayString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },

    seededRandom(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    },

    generateDailyCard() {
        const dateStr = this.state.today;
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
            hash |= 0;
        }

        const deck = getFullDeck();
        const cardIndex = Math.floor(this.seededRandom(hash) * deck.length);
        const isReversed = this.seededRandom(hash + 1) < 0.45;

        return {
            ...deck[cardIndex],
            orientation: isReversed ? '逆位' : '正位'
        };
    },

    getCardReading(card) {
        const isReversed = card.orientation === '逆位';
        const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
        const keywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
        
        return {
            meaning: meaning,
            keywords: keywords,
            advice: card.advice || ''
        };
    },

    async drawCard() {
        if (this.state.hasDrawn || this.state.isDrawing) return;

        this.state.isDrawing = true;
        this.updateDrawButtonState();

        MoonEffects.createFlash('rgba(139,92,246,0.2)');

        await new Promise(resolve => setTimeout(resolve, 500));

        const card = this.generateDailyCard();
        const reading = this.getCardReading(card);
        
        this.state.card = card;
        this.state.reading = reading;
        this.state.hasDrawn = true;

        this.saveDailyData();
        this.saveToHistory(card, reading);

        this.render();

        setTimeout(() => {
            const cardEl = document.getElementById('dailyCard');
            if (cardEl) cardEl.classList.add('revealed');
            MoonEffects.createParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 'rgba(212,168,67,0.6)', 30);
        }, 300);

        this.state.isDrawing = false;
        this.updateDrawButtonState();

        if (MoonConfig.get('apiKey')) {
            setTimeout(() => this.generateAIReading(card), 1500);
        }
    },

    saveDailyData() {
        const data = {
            date: this.state.today,
            card: this.state.card,
            reading: this.state.reading,
            aiReading: this.state.aiReading,
            streak: this.state.streak,
            maxStreak: this.state.maxStreak,
            lastDrawDate: this.state.today
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    saveToHistory(card, reading) {
        const summary = `${card.name}(${card.orientation}) - ${reading.keywords.join('、')}`;
        MoonHistory.addRecord('daily', {
            date: this.state.today,
            card: card,
            reading: reading,
            streak: this.state.streak,
            maxStreak: this.state.maxStreak
        }, summary);
    },

    async generateAIReading(card) {
        if (!MoonConfig.get('apiKey')) return;

        const aiBtn = document.getElementById('aiReadingBtn');
        if (aiBtn) {
            aiBtn.disabled = true;
            aiBtn.textContent = '解读中...';
        }

        try {
            const prompt = `你是月影，月影塔罗屋的占卜师。请为用户解读今日抽到的塔罗牌。

【牌名】${card.name}(${card.orientation})
【牌义】${this.state.reading.meaning}
【关键词】${this.state.reading.keywords.join('、')}

要求：
1. 用神秘、温暖、诗意的语言解读今日运势
2. 结合牌义给出具体的今日指引和建议
3. 150-250字左右
4. 使用🌙✨🔮等符号点缀
5. 结尾给一句温馨的寄语`;

            const result = await MoonAPI.chatSingle(
                '你是月影，月影塔罗屋的占卜师。用神秘、温暖、诗意的语言进行塔罗解读。',
                prompt
            );

            this.state.aiReading = result.content;
            this.saveDailyData();
            this.renderAIReading();
        } catch (error) {
            console.error('AI解读失败:', error);
            MoonUtils.showToast('AI解读失败，请稍后再试');
        } finally {
            if (aiBtn) {
                aiBtn.disabled = false;
                aiBtn.textContent = '✨ AI深度解读';
            }
        }
    },

    bindEvents() {
        const drawBtn = document.getElementById('drawCardBtn');
        if (drawBtn) {
            drawBtn.addEventListener('click', () => this.drawCard());
        }

        const aiBtn = document.getElementById('aiReadingBtn');
        if (aiBtn) {
            aiBtn.addEventListener('click', () => {
                if (!MoonConfig.get('apiKey')) {
                    MoonUtils.showToast('请先在配置中填写 API Key');
                    return;
                }
                this.generateAIReading(this.state.card);
            });
        }
    },

    updateDrawButtonState() {
        const drawBtn = document.getElementById('drawCardBtn');
        if (drawBtn) {
            drawBtn.disabled = this.state.isDrawing;
            drawBtn.textContent = this.state.isDrawing ? '正在抽牌...' : '✨ 抽取今日塔罗';
        }
    },

    render() {
        this.renderStreak();
        this.renderQuote();
        
        if (this.state.hasDrawn && this.state.card) {
            this.renderCard();
            this.renderReading();
            this.renderAIReading();
            document.getElementById('drawCardBtn')?.classList.add('hidden');
            document.getElementById('tomorrowHint')?.classList.remove('hidden');
        } else {
            document.getElementById('cardResult')?.classList.add('hidden');
            document.getElementById('drawCardBtn')?.classList.remove('hidden');
            document.getElementById('tomorrowHint')?.classList.add('hidden');
        }
    },

    renderStreak() {
        const streakEl = document.getElementById('streakCount');
        const maxStreakEl = document.getElementById('maxStreak');
        
        if (streakEl) streakEl.textContent = this.state.streak;
        if (maxStreakEl) maxStreakEl.textContent = this.state.maxStreak;
    },

    renderQuote() {
        const quoteEl = document.getElementById('dailyQuote');
        if (!quoteEl) return;

        const quote = getQuoteByDate(this.state.today);
        quoteEl.innerHTML = `<span class="quote-emoji">${quote.emoji}</span><span class="quote-text">${quote.text}</span>`;
    },

    renderCard() {
        const cardResult = document.getElementById('cardResult');
        if (!cardResult || !this.state.card) return;

        cardResult.classList.remove('hidden');

        const card = this.state.card;
        const imageUrl = MoonUtils.getTarotImageUrl(card.id, TAROT_IMAGE_FILES);
        const isReversed = card.orientation === '逆位';

        document.getElementById('cardImage').src = imageUrl;
        document.getElementById('cardImage').className = `daily-card-image ${isReversed ? 'reversed' : ''}`;
        document.getElementById('cardName').textContent = card.name;
        document.getElementById('cardOrientation').textContent = card.orientation;
        document.getElementById('cardOrientation').className = `card-orientation ${isReversed ? 'reversed' : ''}`;
    },

    renderReading() {
        const readingEl = document.getElementById('cardReading');
        if (!readingEl || !this.state.reading) return;

        readingEl.innerHTML = `
            <div class="reading-section">
                <h3>🔮 牌义解读</h3>
                <p>${this.state.reading.meaning}</p>
            </div>
            <div class="reading-section">
                <h3>💫 关键词</h3>
                <div class="keywords">
                    ${this.state.reading.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                </div>
            </div>
            ${this.state.reading.advice ? `
            <div class="reading-section">
                <h3>🌙 月影建议</h3>
                <p>${this.state.reading.advice}</p>
            </div>` : ''}
        `;
    },

    renderAIReading() {
        const aiReadingEl = document.getElementById('aiReading');
        const aiBtn = document.getElementById('aiReadingBtn');
        
        if (!aiReadingEl) return;

        if (this.state.aiReading) {
            aiReadingEl.innerHTML = `<div class="ai-reading-content">${MoonUtils.formatText(this.state.aiReading)}</div>`;
            aiReadingEl.classList.remove('hidden');
            if (aiBtn) aiBtn.classList.add('hidden');
        } else {
            aiReadingEl.classList.add('hidden');
            if (MoonConfig.get('apiKey') && aiBtn) {
                aiBtn.classList.remove('hidden');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => DailyTarotApp.init());