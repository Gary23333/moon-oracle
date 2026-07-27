export const DAILY_QUOTES = [
    { text: '今日的每一步，都是通往明日的桥梁。', type: 'guidance', emoji: '🌉' },
    { text: '相信你的直觉，它是宇宙给你的指引。', type: 'intuition', emoji: '✨' },
    { text: '放慢脚步，答案藏在寂静之中。', type: 'reflection', emoji: '🌙' },
    { text: '你的努力终将绽放，耐心等待花期。', type: 'encouragement', emoji: '🌸' },
    { text: '拥抱变化，它是成长的必经之路。', type: 'change', emoji: '🍃' },
    { text: '心怀感恩，美好会不期而遇。', type: 'gratitude', emoji: '💫' },
    { text: '勇敢说出内心的声音，世界会听见。', type: 'courage', emoji: '🗣️' },
    { text: '每一次跌倒，都是为了更高的飞翔。', type: 'resilience', emoji: '🦅' },
    { text: '放下过去的包袱，轻装前行。', type: 'letting_go', emoji: '🎒' },
    { text: '今天的选择，决定明天的方向。', type: 'decision', emoji: '🧭' },
    { text: '温柔对待自己，你值得被爱。', type: 'self_love', emoji: '💖' },
    { text: '机遇就在转角，保持期待。', type: 'opportunity', emoji: '🚪' },
    { text: '内心的平静，是最大的力量。', type: 'peace', emoji: '🧘' },
    { text: '与自己和解，是智慧的开始。', type: 'acceptance', emoji: '🕊️' },
    { text: '不要害怕孤独，它是灵魂的伴侣。', type: 'solitude', emoji: '🌌' },
    { text: '行动是梦想的翅膀，现在就出发。', type: 'action', emoji: '🚀' },
    { text: '倾听内心的声音，它比外界更真实。', type: 'inner_voice', emoji: '🎧' },
    { text: '今日的挑战，是明日的勋章。', type: 'challenge', emoji: '🏅' },
    { text: '保持好奇心，世界充满惊喜。', type: 'curiosity', emoji: '🔍' },
    { text: '用爱去理解，而非评判。', type: 'compassion', emoji: '🤝' },
    { text: '小小的改变，能带来大大的不同。', type: 'small_steps', emoji: '🐾' },
    { text: '相信宇宙的安排，一切都是最好的安排。', type: 'trust', emoji: '🌠' },
    { text: '你的光芒，无需隐藏。', type: 'shine', emoji: '🌟' },
    { text: '今天是新的开始，忘记昨天的遗憾。', type: 'fresh_start', emoji: '🌅' },
    { text: '在喧嚣中找到属于你的宁静。', type: 'serenity', emoji: '🍵' },
    { text: '坚持下去，胜利就在前方。', type: 'persistence', emoji: '🔥' },
    { text: '感恩你所拥有的，它们都是礼物。', type: 'gratitude', emoji: '🎁' },
    { text: '做真实的自己，世界会接纳你。', type: 'authenticity', emoji: '💎' },
    { text: '今日的付出，明日会加倍回报。', type: 'karma', emoji: '⚖️' },
    { text: '敞开心扉，美好会自然流入。', type: 'openness', emoji: '🌸' },
    { text: '每一刻都是珍贵的，活在当下。', type: 'present', emoji: '⏳' },
    { text: '你的潜力无限，不要给自己设限。', type: 'potential', emoji: '💫' },
    { text: '面对恐惧，它会成为你的力量。', type: 'fear', emoji: '🦁' },
    { text: '与自然连接，找回内心的平衡。', type: 'nature', emoji: '🌿' },
    { text: '今天的微笑，能照亮他人的世界。', type: 'kindness', emoji: '😊' },
    { text: '相信直觉的指引，它从未出错。', type: 'intuition', emoji: '🔮' },
    { text: '放下焦虑，享受当下的美好。', type: 'mindfulness', emoji: '🌻' },
    { text: '你的存在，本身就是奇迹。', type: 'miracle', emoji: '🌈' },
    { text: '勇敢迈出第一步，剩下的路会自己展开。', type: 'bravery', emoji: '🚶' },
    { text: '今日的沉思，带来明日的清明。', type: 'contemplation', emoji: '📖' }
];

export function getQuoteByDate(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % DAILY_QUOTES.length;
    return DAILY_QUOTES[index];
}