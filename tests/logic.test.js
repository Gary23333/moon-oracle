import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { WheelRenderer } from '../js/wheel/wheel-renderer.js';
import { DailyTarotApp } from '../js/daily/app.js';
import { MoonHistory } from '../js/history/store.js';
import { MoonUtils } from '../js/common/utils.js';
import { getFullDeck } from '../js/tarot/cards-data.js';
import { resetStorage } from './helpers.js';

beforeEach(() => { resetStorage(); MoonHistory._records = null; });

test('wheel result aligns with the top pointer, including weighted sectors and wrapped rotation', () => {
    const wheel = Object.create(WheelRenderer.prototype);
    wheel.options = ['A', 'B', 'C', 'D'];
    wheel.weights = [1, 1, 1, 1];
    for (let index = 0; index < 4; index++) {
        const angle = (index + 0.5) * Math.PI / 2;
        wheel.rotation = 3 * Math.PI / 2 - angle;
        assert.equal(wheel.getResult().index, index);
        wheel.rotation -= 12 * Math.PI;
        assert.equal(wheel.getResult().index, index);
    }
    wheel.options = ['small', 'large']; wheel.weights = [1, 3];
    const counts = [0, 0];
    for (let i = 0; i < 400; i++) {
        wheel.rotation = 3 * Math.PI / 2 - (i + 0.5) * Math.PI * 2 / 400;
        counts[wheel.getResult().index]++;
    }
    assert.deepEqual(counts, [100, 300]);
});
test('wheel weight normalization matches the number of options and clamps invalid values', () => {
    assert.deepEqual(WheelRenderer.prototype._normalizeWeights([0, NaN, 999, 2.6], 5), [1, 1, 100, 3, 1]);
    assert.deepEqual(WheelRenderer.prototype._normalizeWeights([2, 3, 4], 2), [2, 3]);
});
test('daily cards are deterministic for a date and belong to the complete deck', () => {
    DailyTarotApp.state.today = '2026-11-05';
    const first = DailyTarotApp.generateDailyCard();
    assert.deepEqual(DailyTarotApp.generateDailyCard(), first);
    assert.ok(getFullDeck().some(card => card.id === first.id));
    assert.ok(['正位', '逆位'].includes(first.orientation));
});
test('daily streak survives reload, increments once for yesterday, and preserves the maximum', () => {
    const today = DailyTarotApp.getTodayString();
    const yesterday = new Date(`${today}T00:00:00Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    localStorage.setItem('moon_oracle_daily', JSON.stringify({ date: yesterday.toISOString().slice(0, 10), lastDrawDate: yesterday.toISOString().slice(0, 10), streak: 4, maxStreak: 8 }));
    DailyTarotApp.loadDailyData();
    assert.equal(DailyTarotApp.state.streak, 5);
    assert.equal(DailyTarotApp.state.maxStreak, 8);
    DailyTarotApp.loadDailyData();
    assert.equal(DailyTarotApp.state.streak, 5);
    DailyTarotApp.state.card = DailyTarotApp.generateDailyCard();
    DailyTarotApp.saveDailyData();
    DailyTarotApp.loadDailyData();
    assert.equal(DailyTarotApp.state.streak, 5);
    assert.equal(DailyTarotApp.state.hasDrawn, true);
});
test('missing days reset the current streak but retain the historical maximum', () => {
    localStorage.setItem('moon_oracle_daily', JSON.stringify({ lastDrawDate: '2000-01-01', streak: 7, maxStreak: 12 }));
    DailyTarotApp.loadDailyData();
    assert.equal(DailyTarotApp.state.streak, 1);
    assert.equal(DailyTarotApp.state.maxStreak, 12);
});
test('daily record uses trusted card definitions instead of saved HTML', () => {
    const today = DailyTarotApp.getTodayString();
    localStorage.setItem('moon_oracle_daily', JSON.stringify({ date: today, lastDrawDate: today, card: { id: 0, name: '<img onerror=bad>', uprightMeaning: '<script>bad</script>' } }));
    DailyTarotApp.loadDailyData();
    assert.equal(DailyTarotApp.state.card.name, '愚者');
    assert.ok(!DailyTarotApp.state.reading.meaning.includes('<script>'));
});
test('history keeps the newest 50 records in reverse chronological order', () => {
    for (let i = 0; i < 60; i++) MoonHistory.addRecord('quick', { n: i }, String(i));
    assert.equal(MoonHistory.getRecordCount(), 50);
    assert.equal(MoonHistory.getRecords()[0].summary, '59');
    assert.equal(MoonHistory.getRecords().at(-1).summary, '10');
    assert.equal(new Set(MoonHistory.getRecords().map(r => r.id)).size, 50);
    MoonHistory._records = null;
    assert.equal(MoonHistory.getRecordCount(), 50);
});
test('history handles malformed storage and supports filtering and deletion', () => {
    for (const value of ['{bad', '{}', 'null', '[null,{}]']) {
        localStorage.setItem('moon_oracle_history', value); MoonHistory._records = null;
        assert.deepEqual(MoonHistory.getRecords(), []);
    }
    const record = MoonHistory.addRecord('daily', {}, 'daily');
    MoonHistory.addRecord('quick', {}, 'quick');
    assert.equal(MoonHistory.getRecordCount('daily'), 1);
    assert.equal(MoonHistory.getRecord(record.id).summary, 'daily');
    assert.equal(MoonHistory.deleteRecord(record.id), true);
    assert.equal(MoonHistory.deleteRecord(record.id), false);
    MoonHistory.clearRecords();
    assert.equal(MoonHistory.getRecordCount(), 0);
});
test('formatting escapes HTML before adding supported emphasis', () => {
    assert.equal(MoonUtils.formatText('<img src=x onerror="bad"> **safe**'), '&lt;img src=x onerror=&quot;bad&quot;&gt; <strong>safe</strong>');
    assert.equal(MoonUtils.sanitize(123), '123');
});
