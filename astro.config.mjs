// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tina from '@tinacms/astro/integration';

// https://astro.build/config
export default defineConfig({
	// No custom domain yet — fall back to the Cloudflare Workers default host.
	// Set SITE_URL (the real *.workers.dev URL or a custom domain) to override.
	site: process.env.SITE_URL ?? 'https://ssw-website-global.workers.dev',
	output: 'static',
	adapter: cloudflare(),
	redirects: { '/home': '/' },
	integrations: [mdx(), sitemap(), tina()],
	vite: {
		// Bundle @tinacms/astro into the SSR build instead of resolving it
		// per-module on every cold request — otherwise each
		// `import TinaMarkdown from '@tinacms/astro/TinaMarkdown.astro'`
		// triggers a full Vite resolve + Astro-plugin compile of the
		// package's source `.astro` files on the first request.
		ssr: {
			noExternal: ['@tinacms/astro', '@tinacms/bridge'],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
						warning.exporter === 'tinacms/dist/client'
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
});
