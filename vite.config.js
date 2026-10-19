import { defineConfig } from 'vite';
import { resolve } from 'path';
import { handleChat } from './server/app.js';

/**
 * 开发（dev / preview）模式下把 /api/chat 交给 server/app.js 的 handleChat 处理，
 * 保证 `npm run dev` 单命令即可跑通流式代理，无需额外启动后端服务。
 */
function apiProxyPlugin() {
  const middleware = (req, res, next) => {
    const url = req.url || '';
    if (url === '/api/chat' || url.startsWith('/api/chat?')) {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        res.end();
        return;
      }
      if (req.method === 'POST') {
        handleChat(req, res);
        return;
      }
    }
    next();
  };

  return {
    name: 'moon-oracle-api-proxy',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [apiProxyPlugin()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        tarot: resolve(__dirname, 'tarot.html'),
        wheel: resolve(__dirname, 'wheel.html'),
        daily: resolve(__dirname, 'daily.html'),
        quick: resolve(__dirname, 'quick.html'),
        history: resolve(__dirname, 'history.html')
      }
    }
  }
});
