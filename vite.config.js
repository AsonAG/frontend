import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
        port: 3003
    }
  };
});