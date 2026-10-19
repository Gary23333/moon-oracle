// 月影决策屋 - Node 原生生产服务器
// 零依赖：托管 dist/ 静态资源 + 挂载 POST /api/chat 代理。

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChat } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');

// ---- 极简 .env 加载（无第三方依赖）----
function loadEnv() {
    const envPath = path.join(ROOT, '.env');
    let content;
    try {
        content = fs.readFileSync(envPath, 'utf8');
    } catch (err) {
        return; // .env 不存在也不应报错
    }
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (key && !(key in process.env)) {
            process.env[key] = value;
        }
    }
}
loadEnv();

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function isInside(dir, target) {
    const rel = path.relative(dir, target);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/** 解析静态文件：精确文件 → `${path}.html` → `${path}/index.html`。 */
function resolveStaticFile(pathname) {
    let rel = decodeURIComponent(pathname).replace(/^\/+/, '');
    if (rel === '') rel = 'index.html';

    const base = path.resolve(DIST_DIR, rel);
    const candidates = [base];
    if (rel.endsWith('.html')) {
        candidates.push(path.join(base, 'index.html'));
    } else {
        candidates.push(`${base}.html`);
        candidates.push(path.join(base, 'index.html'));
    }

    for (const candidate of candidates) {
        if (!isInside(DIST_DIR, candidate)) continue;
        try {
            if (fs.statSync(candidate).isFile()) return candidate;
        } catch (err) { /* 不存在则继续尝试下一个 */ }
    }
    return null;
}

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Server Error');
        } else {
            res.end();
        }
    });
    stream.pipe(res);
}

const server = http.createServer((req, res) => {
    let pathname = '/';
    try {
        const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        pathname = parsed.pathname;
    } catch (err) {
        pathname = '/';
    }

    // API 代理
    if (pathname === '/api/chat') {
        if (req.method === 'OPTIONS') {
            setCors(res);
            res.statusCode = 204;
            res.end();
            return;
        }
        if (req.method === 'POST') {
            handleChat(req, res);
            return;
        }
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: { message: '仅支持 POST 请求' } }));
        return;
    }

    // 其它路径的 CORS 预检
    if (req.method === 'OPTIONS') {
        setCors(res);
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Method Not Allowed');
        return;
    }

    const filePath = resolveStaticFile(pathname);
    if (!filePath) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('404 Not Found');
        return;
    }

    if (req.method === 'HEAD') {
        const ext = path.extname(filePath).toLowerCase();
        res.statusCode = 200;
        res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
        res.end();
        return;
    }

    sendFile(res, filePath);
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`🌙 月影决策屋服务已启动：http://localhost:${PORT}`);
    console.log(`   API     : POST http://localhost:${PORT}/api/chat`);
    console.log(`   静态目录 : ${DIST_DIR}`);
});
