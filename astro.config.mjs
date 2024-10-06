import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// https://docs.astro.build/en/reference/configuration-reference/#markdown-options
// https://docs.astro.build/en/guides/markdown-content/#extending-markdown-config-from-mdx
export default defineConfig({
  site: 'https://overworldsoft.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  server: {
    port: 4322, // different dev port from other astro sites
  },
});
