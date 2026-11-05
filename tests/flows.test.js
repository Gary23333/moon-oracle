import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { WheelAIGenerator } from '../js/wheel/ai-generator.js';
import { TarotApp } from '../js/tarot/app.js';
import { WheelApp } from '../js/wheel/app.js';
import { MoonEffects } from '../js/common/effects.js';
import { MoonAPI } from '../js/common/api.js';
import { MoonConfig } from '../js/common/config.js';
import { MoonUtils } from '../js/common/utils.js';
import { MoonHistory } from '../js/history/store.js';
import { getFullDeck } from '../js/tarot/cards-data.js';
import { resetStorage } from './helpers.js';

const chatSingle = MoonAPI.chatSingle;

test('wheel result overrides the hidden CSS default and exposes its controls', t => {
    const elements = Object.fromEntries(['spinBtn', 'resultArea', 'resultOption', 'resultWheelName'].map(id => [id, { style: {}, textContent: '' }]));
    elements.resultArea.style.display = 'none';
    t.mock.method(WheelApp, '_safeGetElement', id => elements[id]);
    t.mock.method(MoonEffects, 'createFlash', () => {});
    t.mock.method(MoonConfig, 'get', () => false);
    WheelApp.showResult({ option: 'A' }, 'Test wheel');
    assert.equal(elements.resultArea.style.display, 'block');
    assert.equal(elements.spinBtn.style.display, 'none');
    assert.equal(elements.resultOption.textContent, 'A');
    assert.equal(elements.resultWheelName.textContent, 'Test wheel');
});
beforeEach(() => { resetStorage(); MoonConfig.init(); MoonHistory._records = null; });
afterEach(() => { MoonAPI.chatSingle = chatSingle; });

test('AI-generated wheels reject non-string and empty options before rendering', async t => {
    t.mock.method(console, 'error', () => {});
    for (const options of [[{}, 'valid'], ['valid', 1], ['valid', ' '], ['one']]) {
        MoonAPI.chatSingle = async () => ({ content: JSON.stringify({ options }) });
        assert.equal((await WheelAIGenerator._parseWheelFromAI('', '')).success, false);
    }
});
test('AI-generated wheels trim and bound output without trusting metadata types', async () => {
    MoonAPI.chatSingle = async () => ({ content: JSON.stringify({ name: 123, icon: 123, options: Array.from({ length: 15 }, (_, n) => ` option ${n} `) }) });
    const result = await WheelAIGenerator._parseWheelFromAI('', '');
    assert.equal(result.success, true);
    assert.equal(result.data.options.length, 12);
    assert.equal(result.data.options[0], 'option 0');
    assert.equal(result.data.name, '自定义转盘');
    assert.equal(result.data.icon, '🎡');
});
test('successful tarot reading persists the question, spread, cards and reading', async t => {
    t.mock.method(MoonUtils, 'showLoading', () => {});
    t.mock.method(MoonUtils, 'hideLoading', () => {});
    t.mock.method(MoonUtils, 'showToast', message => assert.fail(message));
    t.mock.method(TarotApp, 'showResult', () => {});
    MoonAPI.chatSingle = async () => ({ content: 'Mock reading' });
    Object.assign(TarotApp.state, { question: 'How is today?', category: 'daily', spreadType: 'single', revealedCards: [{ ...getFullDeck()[0], orientation: '正位' }] });
    await TarotApp.performReading();
    const records = MoonHistory.getRecords('tarot');
    assert.equal(records.length, 1);
    assert.equal(records[0].data.readingResult, 'Mock reading');
    assert.equal(records[0].data.question, 'How is today?');
    assert.deepEqual(records[0].data.spreadPositions, ['核心答案']);
    assert.equal(records[0].data.revealedCards[0].id, 0);
});
test('cancelled typing resolves its pending promise', async t => {
    t.mock.method(globalThis, 'setInterval', () => 123);
    t.mock.method(globalThis, 'clearInterval', () => {});
    const oldDocument = globalThis.document;
    globalThis.document = { createElement: () => ({ childNodes: [], innerHTML: '' }) };
    try {
        const pending = MoonUtils.typeText({ innerHTML: '', querySelectorAll: () => [] }, 'test');
        MoonUtils._activeTyping.cancel();
        await pending;
    } finally {
        MoonUtils._activeTyping = null;
        if (oldDocument === undefined) delete globalThis.document;
        else globalThis.document = oldDocument;
    }
});

