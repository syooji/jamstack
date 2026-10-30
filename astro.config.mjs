// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages 用設定（GitHub Pages 用の site/base は不要）
export default defineConfig({
  // site: 'https://syooji.github.io',
  // base: '/jamstack',
  // trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});