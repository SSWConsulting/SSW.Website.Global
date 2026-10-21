// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
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
	// Adapter v13 defaults to runtime image transforms through a Cloudflare
	// Images binding. All images here are static, so optimise them at build
	// time instead — the adapter v12 default.
	adapter: cloudflare({ imageService: 'compile' }),
	// The site uses no sessions. Without an explicit driver, adapter v13 adds
	// a SESSION KV binding and Wrangler provisions a namespace on deploy.
	session: { driver: sessionDrivers.memory() },
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
	},
});
