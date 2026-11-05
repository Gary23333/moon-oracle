import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { MoonConfig } from '../js/common/config.js';
import { resetStorage } from './helpers.js';

beforeEach(() => { resetStorage(); MoonConfig.init(); });

test('keys default to session storage and are not written into local settings', () => {
    MoonConfig.set('apiKey', 'test-key');
    assert.equal(sessionStorage.getItem('moon_oracle_api_key'), 'test-key');
    assert.equal(JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey, undefined);
    assert.equal(MoonConfig.load().apiKey, 'test-key');
    sessionStorage.clear();
    assert.equal(MoonConfig.load().apiKey, '');
});
test('remembering a key is opt-in and clearing removes both stores', () => {
    Object.assign(MoonConfig.current, { apiKey: 'test-key', rememberApiKey: true });
    MoonConfig.save();
    assert.equal(JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey, 'test-key');
    assert.equal(sessionStorage.getItem('moon_oracle_api_key'), null);
    MoonConfig.clearApiKey();
    assert.equal(MoonConfig.load().apiKey, '');
    assert.equal(sessionStorage.getItem('moon_oracle_api_key'), null);
    assert.equal(JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey, undefined);
});
test('turning remember off moves the key to session storage', () => {
    Object.assign(MoonConfig.current, { apiKey: 'test-key', rememberApiKey: true });
    MoonConfig.save();
    MoonConfig.set('rememberApiKey', false);
    assert.equal(sessionStorage.getItem('moon_oracle_api_key'), 'test-key');
    assert.equal(JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey, undefined);
});
test('legacy persistent keys migrate to the current tab without silently opting in', () => {
    localStorage.setItem('moon_oracle_config', JSON.stringify({ apiKey: 'legacy-test-key' }));
    MoonConfig.init();
    assert.equal(MoonConfig.get('apiKey'), 'legacy-test-key');
    assert.equal(MoonConfig.get('rememberApiKey'), false);
    assert.equal(JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey, undefined);
    assert.equal(sessionStorage.getItem('moon_oracle_api_key'), 'legacy-test-key');
});
test('partial nested settings merge without modifying defaults', () => {
    localStorage.setItem('moon_oracle_config', JSON.stringify({ tarotPrompts: { greeting: 'custom' } }));
    MoonConfig.init();
    assert.equal(MoonConfig.current.tarotPrompts.greeting, 'custom');
    assert.equal(MoonConfig.current.tarotPrompts.reading, MoonConfig.defaults.tarotPrompts.reading);
    assert.notEqual(MoonConfig.defaults.tarotPrompts.greeting, 'custom');
    MoonConfig.reset();
    MoonConfig.current.tarotPrompts.greeting = 'changed';
    assert.notEqual(MoonConfig.defaults.tarotPrompts.greeting, 'changed');
});
test('malformed, null and array settings recover to defaults', () => {
    for (const value of ['{broken', 'null', '[]', '7']) {
        localStorage.setItem('moon_oracle_config', value);
        assert.equal(MoonConfig.load().model, MoonConfig.defaults.model);
    }
});
test('prototype keys are ignored', () => {
    const config = MoonConfig._deepMerge(MoonConfig.defaults, JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}'));
    assert.equal(Object.hasOwn(config, '__proto__'), false);
    assert.equal(Object.hasOwn(config, 'constructor'), false);
    assert.equal({}.polluted, undefined);
});
test('blocked browser storage does not crash initialization and reports save failure', () => {
    globalThis.localStorage = globalThis.sessionStorage = {
        getItem() { throw new Error('blocked'); },
        setItem() { throw new Error('blocked'); },
        removeItem() { throw new Error('blocked'); }
    };
    assert.doesNotThrow(() => MoonConfig.init());
    assert.equal(MoonConfig.save(), false);
});
