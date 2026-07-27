import { MoonConfig } from '../common/config.js';
import { MoonAPI } from '../common/api.js';
import { MoonUtils } from '../common/utils.js';
import { MoonEffects } from '../common/effects.js';
import { MoonOracle } from './oracle.js';
import { MoonAnswers } from './answers.js';
import { MoonHistory } from '../history/store.js';

class QuickApp {
    constructor() {
        this.questionInput = document.getElementById('questionInput');
        this.oracleBtn = document.getElementById('oracleBtn');
        this.answerBtn = document.getElementById('answerBtn');
        this.resultContainer = document.getElementById('resultContainer');
        this.aiEnhanceCheckbox = document.getElementById('aiEnhanceCheckbox');
        this.aiEnhanceContainer = document.getElementById('aiEnhanceContainer');
        
        this.init();
    }

    init() {
        MoonConfig.init();
        MoonEffects.init();
        MoonEffects.createStars('starsContainer');

        this.bindEvents();
        this.updateAIEnhanceVisibility();
    }

    bindEvents() {
        this.oracleBtn.addEventListener('click', () => this.handleOracle());
        this.answerBtn.addEventListener('click', () => this.handleAnswerBook());
        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleOracle();
            }
        });
        MoonConfig.current.apiKey && this.aiEnhanceCheckbox?.addEventListener('change', () => this.updateAIEnhanceVisibility());
    }

    updateAIEnhanceVisibility() {
        if (this.aiEnhanceContainer && this.aiEnhanceCheckbox) {
            const hasApiKey = MoonConfig.current.apiKey && MoonConfig.current.apiKey.length > 0;
            this.aiEnhanceContainer.style.display = hasApiKey ? 'flex' : 'none';
        }
    }

    async handleOracle() {
        const question = this.questionInput.value.trim();
        if (!question) {
            MoonUtils.showToast('请输入你的问题');
            return;
        }

        this.showLoading();
        
        try {
            const result = MoonOracle.draw(question);
            const useAI = this.aiEnhanceCheckbox?.checked || false;
            
            if (useAI && MoonConfig.current.apiKey) {
                result.aiInterpretation = await this.getAIInterpretation(question, result);
            }
            
            await this.displayOracleResult(result);
            this.saveToHistory(result);
            
            MoonEffects.createParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
        } catch (error) {
            MoonUtils.showToast(error.message);
            console.error('Oracle error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async handleAnswerBook() {
        const question = this.questionInput.value.trim();
        if (!question) {
            MoonUtils.showToast('请输入你的问题');
            return;
        }

        this.showLoading();
        
        try {
            const result = MoonAnswers.draw(question);
            await this.displayAnswerResult(result);
            this.saveToHistory(result);
            
            MoonEffects.createFlash();
        } catch (error) {
            MoonUtils.showToast(error.message);
            console.error('Answer book error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async getAIInterpretation(question, oracleResult) {
        const prompt = `你是月影，月影塔罗屋的占卜师。用户问了一个是非问题："${question}"。
塔罗牌抽取结果：
- 牌名：${oracleResult.card.name}（${oracleResult.card.isReversed ? '逆位' : '正位'}）
- 牌组：${oracleResult.card.arcana === 'major' ? '大阿卡纳' : 
    oracleResult.card.suit === 'wands' ? '权杖' : 
    oracleResult.card.suit === 'cups' ? '圣杯' : 
    oracleResult.card.suit === 'swords' ? '宝剑' : '星币'}
- 元素：${oracleResult.card.element || '未知'}
- 关键词：${oracleResult.card.keywords.join('、')}
- 牌义：${oracleResult.card.meaning}
- 快占结果：${oracleResult.resultText}

请用神秘、温暖、诗意的语言对这个结果进行更详细的解读。
要求：
1. 结合牌的正逆位和牌义进行深入分析
2. 给出具体的建议和指引
3. 保持神秘感但不要过于晦涩
4. 150-250字
5. 使用🌙✨🔮等符号点缀`;

        try {
            const response = await MoonAPI.chatSingle(prompt, question);
            return response.content;
        } catch (e) {
            console.warn('AI interpretation failed:', e.message);
            return null;
        }
    }

    async displayOracleResult(result) {
        const resultText = result.resultText;
        const resultColor = result.result === 'yes' ? 'var(--color-gold)' : 
            result.result === 'no' ? '#ef4444' : '#8b5cf6';
        const resultBg = result.result === 'yes' ? 'rgba(212, 168, 67, 0.1)' : 
            result.result === 'no' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)';

        let html = `
            <div class="result-card oracle-card" style="background: ${resultBg};">
                <div class="result-header">
                    <div class="result-icon" style="color: ${resultColor};">
                        ${result.result === 'yes' ? '✅' : result.result === 'no' ? '❌' : '🔮'}
                    </div>
                    <div class="result-title" style="color: ${resultColor};">${resultText}</div>
                </div>
                
                <div class="card-info">
                    <div class="card-symbol">${result.card.symbol || '🃏'}</div>
                    <div class="card-details">
                        <div class="card-name">${result.card.name}</div>
                        <div class="card-position">${result.card.isReversed ? '逆位' : '正位'} · 
                            ${result.card.arcana === 'major' ? '大阿卡纳' : 
                                result.card.suit === 'wands' ? '权杖' : 
                                result.card.suit === 'cups' ? '圣杯' : 
                                result.card.suit === 'swords' ? '宝剑' : '星币'}
                        </div>
                    </div>
                </div>
                
                <div class="result-comment">
                    ${MoonUtils.formatText(result.comment)}
                </div>
        `;

        if (result.aiInterpretation) {
            html += `
                <div class="ai-section">
                    <div class="ai-label">🧠 AI 深度解读</div>
                    <div class="ai-content">${MoonUtils.formatText(result.aiInterpretation)}</div>
                </div>
            `;
        }

        html += `</div>`;

        this.resultContainer.innerHTML = html;
        this.animateResult();
    }

    async displayAnswerResult(result) {
        const styleColors = {
            encouraging: { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
            philosophical: { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
            mystical: { text: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
            reflective: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            humorous: { text: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' }
        };

        const colors = styleColors[result.style] || styleColors.mystical;

        const html = `
            <div class="result-card answer-card" style="background: ${colors.bg};">
                <div class="answer-icon">${result.icon}</div>
                <div class="answer-quote" style="color: ${colors.text};">
                    "${result.quote}"
                </div>
                <div class="answer-footer">
                    <span class="answer-style">${this.getStyleLabel(result.style)}</span>
                    <span class="answer-tag">答案之书</span>
                </div>
            </div>
        `;

        this.resultContainer.innerHTML = html;
        this.animateResult();
    }

    getStyleLabel(style) {
        const labels = {
            encouraging: '🌟 鼓励',
            philosophical: '🌙 哲理',
            mystical: '✨ 神秘',
            reflective: '🍃 反思',
            humorous: '😄 幽默'
        };
        return labels[style] || style;
    }

    saveToHistory(result) {
        let summary = '';
        if (result.type === 'oracle') {
            summary = `Yes/No 快占：${result.resultText} · ${result.card.name}`;
        } else if (result.type === 'answer_book') {
            summary = `答案之书：${result.quote.substring(0, 30)}...`;
        }
        
        MoonHistory.addRecord('quick', result, summary);
    }

    showLoading() {
        MoonUtils.showLoading('月影正在为你占卜...');
        this.oracleBtn.disabled = true;
        this.answerBtn.disabled = true;
    }

    hideLoading() {
        MoonUtils.hideLoading();
        this.oracleBtn.disabled = false;
        this.answerBtn.disabled = false;
    }

    animateResult() {
        const card = this.resultContainer.querySelector('.result-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuickApp();
});