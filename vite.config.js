import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      spaFallbackWithDot(),
      react()
    ],
    server: {
        open: true,
        port: 3003
    }
  };
});

function spaFallbackWithDot() {
  return {
    name: 'spa-fallback-with-dot',
    configureServer(server) {
      return () => {
        server.middlewares.use(function customSpaFallback(req, res, next) {
          if (req.url.includes('.') && !req.url.endsWith('.html')) {
            req.url = '/index.html'
          }
          next()
        })
      }
    }
  }
}