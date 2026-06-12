import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import config from '../content/config/config.json';
import { listBlogs } from '../lib/data';

export const prerender = true;

export async function GET(context: APIContext) {
	// `site` is always set in astro.config.mjs; fail loudly if that ever changes
	// rather than emitting a feed with broken relative links.
	if (!context.site) {
		throw new Error('`site` must be set in astro.config.mjs to generate the RSS feed.');
	}
	const posts = await listBlogs();
	return rss({
		title: config.seo.title,
		description: config.seo.description,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description ?? undefined,
			pubDate: post.pubDate ? new Date(post.pubDate) : undefined,
			// Match the blog routes (blog/index.astro, blog/[...slug].astro):
			// derive the slug from relativePath so nested posts link correctly.
			link: `/blog/${post._sys?.relativePath?.replace(/\.mdx?$/, '') ?? ''}/`,
		})),
	});
}
