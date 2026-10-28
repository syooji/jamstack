// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Cloudflare Workers向け設定
// （GitHub Pages用の site/base は Cloudflare では不要なためコメントアウト）
export default defineConfig({
  // site: 'https://syooji.github.io',
  // base: '/jamstack',
  // trailingSlash: 'always',
  adapter: cloudflare(),
  output: 'server',
});
