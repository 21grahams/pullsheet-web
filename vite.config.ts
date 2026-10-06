/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// The URL path the app is served from. GitHub Pages serves this repo at
// /pullsheet-web/; override with VITE_BASE (e.g. "/pullsheet/") if the app
// ever takes over the old app's address at cutover.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/pullsheet-web/';

  // Shown in Settings → About so you can tell which version a device runs.
  // GITHUB_SHA is set by GitHub Actions; local builds show "dev".
  const version = (process.env.GITHUB_SHA ?? 'dev').slice(0, 7);
  const builtAt = new Date().toISOString();

  return {
    base,
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __BUILT_AT__: JSON.stringify(builtAt),
    },
    plugins: [
      react(),
      VitePWA({
        // A new deploy is downloaded in the background on launch and takes
        // over right away, so updates arrive within one or two launches and
        // a stale app can never stick around.
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'PullSheet',
          short_name: 'PullSheet',
          description: 'Pokémon collection portfolio tracker by NotAStockGenius',
          start_url: base,
          scope: base,
          display: 'standalone',
          orientation: 'portrait-primary',
          background_color: '#0E0F11',
          theme_color: '#0E0F11',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
          ],
        },
        workbox: {
          // Precache the app shell (including self-hosted fonts) so it opens
          // with no signal. Data is never cached here; that's TanStack Query's job.
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
