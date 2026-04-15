import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: '/', // ✅ VERY IMPORTANT

    plugins: [
      react(),
      tailwindcss(),

      VitePWA({
        registerType: 'autoUpdate',

        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,

          // ✅ FIX: allow SPA routing fallback
          navigateFallback: '/index.html',

          // ✅ Avoid caching API / Firestore calls
          navigateFallbackDenylist: [
            /^\/api/,
            /^\/__/,
            /firebase/,
          ],
        },

        manifest: {
          name: 'Fitin60ai.in',
          short_name: 'Fitin60',
          description: 'Generate a personalized workout and diet plan in 60 seconds.',
          theme_color: '#10b981',
          background_color: '#09090b',
          display: 'standalone',
        },
      }),
    ],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''
      ),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''
      ),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
