import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.API_HOST': JSON.stringify(env.API_HOST),
    },
    resolve: {
      alias: {
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@ui': path.resolve(__dirname, 'src/ui'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    plugins: [
      react(),
      tsconfigPaths(), 
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      exclude: ['e2e', 'playwright', '**/e2e/**', '**/e2e/**/*.ts'],
    },
  };
});
