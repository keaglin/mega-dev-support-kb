import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    mdsvex({
      extensions: ['.svx'],
      layout: {
        runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url))
      }
    }),
    vitePreprocess()
  ],
  kit: {
    adapter: adapter(),
    alias: {
      '#lib': fileURLToPath(new URL('./src/lib', import.meta.url))
    }
  }
};

export default config;
