import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  // 檢查憑證檔案是否存在
  const hasCerts =
    isDev &&
    fs.existsSync('./.cert/key.pem') &&
    fs.existsSync('./.cert/cert.pem');

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    server: hasCerts
      ? {
          https: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem'),
          },
          host: 'localhost',
          port: 5174,
        }
      : {
          host: 'localhost',
          port: 5174,
        },
  };
});
