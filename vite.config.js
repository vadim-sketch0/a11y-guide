// vite.config.js – збирання для GitHub Pages (сайт розміщено в підкаталозі /a11y-guide/)
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Prettier записує порожні елементи як <img … />; у HTML скісна риска зайва (валідатор W3C позначає її),
// тому у виробничому HTML її прибираємо.
const htmlVoidSlash = () => ({
  name: 'html-void-slash',
  transformIndexHtml: html => html.replace(/<((?:img|source|input|meta|link|br|hr)\b[^>]*?)\s*\/>/g, '<$1>'),
});

export default defineConfig({
  base: '/a11y-guide/',
  plugins: [tailwindcss(), htmlVoidSlash()],
});
