import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MoonAPI } from '../js/common/api.js';
import { MoonConfig } from '../js/common/config.js';

const originalFetch = globalThis.fetch;
beforeEach(() => { MoonConfig.current = { ...MoonConfig.defaults, apiKey: 'fake-test-key' }; });
afterEach(() => { MoonAPI.abort(); globalThis.fetch = originalFetch; });

test('API URLs require HTTPS except exact loopback hosts and reject credentials/query/hash', () => {
    assert.equal(MoonAPI.validateApiUrl(' https://api.example.com/v1/ '), 'https://api.example.com/v1');
    for (const url of ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://[::1]:8000']) assert.equal(MoonAPI.validateApiUrl(url), url);
    for (const url of ['http://api.example.com', 'javascript:alert(1)', 'https://a:b@api.example.com', 'https://api.example.com?k=key', 'https://api.example.com/#key', 'http://localhost.evil.com', 'broken']) assert.throws(() => MoonAPI.validateApiUrl(url));
});
test('missing key and insecure endpoint fail before any network request', async () => {
    globalThis.fetch = () => assert.fail('network must not be called');
    MoonConfig.current.apiKey = '';
    await assert.rejects(MoonAPI.chat([]), /API Key/);
    MoonConfig.current.apiKey = 'fake-test-key'; MoonConfig.current.apiUrl = 'http://example.com';
    await assert.rejects(MoonAPI.chat([]), /HTTPS/);
});
test('request uses the chosen endpoint without following redirects and maps the response', async () => {
    MoonConfig.current.apiUrl = 'https://api.example.com/v1/';
    globalThis.fetch = async (url, options) => {
        assert.equal(url, 'https://api.example.com/v1/chat/completions');
        assert.equal(options.redirect, 'error');
        assert.equal(options.headers.Authorization, 'Bearer fake-test-key');
        assert.equal(JSON.parse(options.body).stream, false);
        return new Response(JSON.stringify({ choices: [{ message: { content: 'hello', reasoning_content: 'reason' } }], usage: { total_tokens: 3 } }));
    };
    assert.deepEqual(await MoonAPI.chat([{ role: 'user', content: 'hi' }]), { content: 'hello', thinking: 'reason', usage: { total_tokens: 3 } });
    assert.equal(MoonAPI._controller, null);
    assert.equal(MoonAPI._timeoutId, null);
});
test('HTTP errors and empty responses are surfaced', async () => {
    globalThis.fetch = async () => new Response('', { status: 401 });
    await assert.rejects(MoonAPI.chat([]), /API Key 无效/);
    globalThis.fetch = async () => new Response('{}');
    await assert.rejects(MoonAPI.chat([]), /返回内容为空/);
});
test('aborting an older request cannot cancel the newer request timeout', async () => {
    globalThis.fetch = (url, options) => new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
    const first = MoonAPI.chat([], { timeout: 1000 });
    const firstRejection = assert.rejects(first, /取消或超时/);
    const second = MoonAPI.chat([], { timeout: 20 });
    await Promise.all([firstRejection, assert.rejects(second, /取消或超时/)]);
    assert.equal(MoonAPI._controller, null);
});
test('timeout still covers response body consumption', async () => {
    globalThis.fetch = async (url, options) => ({ ok: true, json: () => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))) });
    await assert.rejects(MoonAPI.chat([], { timeout: 20 }), /取消或超时/);
});
