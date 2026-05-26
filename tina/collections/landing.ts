import type { Collection } from 'tinacms';

export const LandingCollection: Collection = {
	name: 'landing',
	label: 'Landing page',
	path: 'src/content/landing',
	format: 'json',
	ui: {
		allowedActions: { create: false, delete: false },
		router: ({ document }) =>
			document._sys.filename === 'home' ? '/' : `/${document._sys.filename}`,
	},
	fields: [
		{
			type: 'object',
			name: 'meta',
			label: 'SEO metadata',
			fields: [
				{ type: 'string', name: 'title', label: 'Page title', required: true },
				{
					type: 'string',
					name: 'description',
					label: 'Meta description',
					ui: { component: 'textarea' },
					required: true,
				},
			],
		},

		{
			type: 'object',
			name: 'nav',
			label: 'Navigation',
			fields: [
				{ type: 'image', name: 'logo', label: 'Logo' },
				{ type: 'string', name: 'region', label: 'Region label' },
				{
					type: 'string',
					name: 'capabilitiesLabel',
					label: 'Capabilities menu label',
				},
				{
					type: 'object',
					name: 'capabilities',
					label: 'Capabilities dropdown',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{
							type: 'string',
							name: 'icon',
							label: 'Font Awesome icon (e.g. fa-robot)',
						},
						{ type: 'string', name: 'title', label: 'Title' },
						{ type: 'string', name: 'description', label: 'Description' },
						{ type: 'string', name: 'href', label: 'Link' },
					],
				},
				{
					type: 'object',
					name: 'links',
					label: 'Nav links',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.label }) },
					fields: [
						{ type: 'string', name: 'label', label: 'Label' },
						{ type: 'string', name: 'href', label: 'Link' },
					],
				},
				{ type: 'string', name: 'ctaLabel', label: 'CTA button label' },
				{ type: 'string', name: 'ctaHref', label: 'CTA button link' },
			],
		},

		{
			type: 'object',
			name: 'hero',
			label: 'Hero',
			fields: [
				{ type: 'string', name: 'eyebrow', label: 'Eyebrow' },
				{
					type: 'string',
					name: 'title',
					label: 'Title',
					description:
						'Wrap the red accent part in **double asterisks**. Example: Enterprise software, shipped at **AI speed**.',
				},
				{
					type: 'string',
					name: 'lead',
					label: 'Lead paragraph',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'primaryCta',
					label: 'Primary CTA',
					fields: [
						{ type: 'string', name: 'label', label: 'Label' },
						{ type: 'string', name: 'href', label: 'Link' },
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
					],
				},
				{
					type: 'object',
					name: 'secondaryCta',
					label: 'Secondary CTA',
					fields: [
						{ type: 'string', name: 'label', label: 'Label' },
						{ type: 'string', name: 'href', label: 'Link' },
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
					],
				},
				{
					type: 'object',
					name: 'checks',
					label: 'Trust checks',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.text }) },
					fields: [{ type: 'string', name: 'text', label: 'Text' }],
				},
				{ type: 'image', name: 'image', label: 'Hero image' },
				{ type: 'string', name: 'imageAlt', label: 'Hero image alt text' },
			],
		},

		{
			type: 'object',
			name: 'stats',
			label: 'Stats strip',
			list: true,
			ui: {
				itemProps: (item) => ({
					label: `${item?.number ?? ''}${item?.suffix ?? ''} — ${item?.label ?? ''}`,
				}),
			},
			fields: [
				{ type: 'string', name: 'number', label: 'Number' },
				{ type: 'string', name: 'suffix', label: 'Suffix (red, e.g. +, ×, %)' },
				{
					type: 'string',
					name: 'label',
					label: 'Label',
					ui: { component: 'textarea' },
				},
			],
		},

		{
			type: 'object',
			name: 'benefitsSection',
			label: 'Benefits section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'items',
					label: 'Benefits',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
					],
				},
			],
		},

		{
			type: 'object',
			name: 'servicesSection',
			label: 'Capabilities section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'items',
					label: 'Services',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
					],
				},
			],
		},

		{
			type: 'object',
			name: 'howSection',
			label: 'How it works section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'steps',
					label: 'Steps',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
						{
							type: 'string',
							name: 'stepLabel',
							label: 'Step label (e.g. Step 01)',
						},
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
					],
				},
			],
		},

		{
			type: 'object',
			name: 'whySection',
			label: 'Why SSW section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'rows',
					label: 'Rows',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
					],
				},
				{
					type: 'object',
					name: 'testimonial',
					label: 'Testimonial',
					fields: [
						{
							type: 'string',
							name: 'quote',
							label: 'Quote',
							ui: { component: 'textarea' },
						},
						{
							type: 'string',
							name: 'avatarInitials',
							label: 'Avatar initials',
						},
						{ type: 'string', name: 'name', label: 'Name' },
						{ type: 'string', name: 'role', label: 'Role / company' },
					],
				},
			],
		},

		{
			type: 'object',
			name: 'faqSection',
			label: 'FAQ section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'helper',
					label: 'Helper card',
					fields: [
						{ type: 'string', name: 'kicker', label: 'Kicker' },
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
						{ type: 'string', name: 'ctaLabel', label: 'CTA label' },
						{ type: 'string', name: 'ctaHref', label: 'CTA link' },
						{ type: 'string', name: 'ctaIcon', label: 'CTA Font Awesome icon' },
					],
				},
				{
					type: 'object',
					name: 'items',
					label: 'Questions',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.question }) },
					fields: [
						{ type: 'string', name: 'question', label: 'Question' },
						{
							type: 'object',
							name: 'paragraphs',
							label: 'Answer paragraphs',
							list: true,
							ui: {
								itemProps: (item) => ({ label: item?.text?.slice(0, 60) }),
							},
							fields: [
								{
									type: 'string',
									name: 'text',
									label: 'Paragraph',
									ui: { component: 'textarea' },
								},
							],
						},
						{
							type: 'boolean',
							name: 'openByDefault',
							label: 'Open by default',
						},
					],
				},
			],
		},

		{
			type: 'object',
			name: 'contactSection',
			label: 'Contact section',
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kicker' },
				{ type: 'string', name: 'title', label: 'Section title' },
				{
					type: 'string',
					name: 'lead',
					label: 'Lead',
					ui: { component: 'textarea' },
				},
				{
					type: 'object',
					name: 'form',
					label: 'Form copy',
					fields: [
						{ type: 'string', name: 'title', label: 'Form title' },
						{ type: 'string', name: 'description', label: 'Form description' },
						{
							type: 'string',
							name: 'submitLabel',
							label: 'Submit button label',
						},
						{
							type: 'string',
							name: 'submitIcon',
							label: 'Submit icon (Font Awesome)',
						},
						{
							type: 'string',
							name: 'privacy',
							label: 'Privacy text',
							ui: { component: 'textarea' },
						},
						{
							type: 'string',
							name: 'privacyLinkLabel',
							label: 'Privacy link label',
						},
						{
							type: 'string',
							name: 'privacyLinkHref',
							label: 'Privacy link URL',
						},
						{ type: 'string', name: 'successText', label: 'Success message' },
						{
							type: 'string',
							name: 'jotformId',
							label: 'Jotform form ID',
							required: true,
							description:
								'Numeric ID from https://form.jotform.com/{id}. Submissions POST to https://submit.jotform.com/submit/{id}/ — Jotform field names must match: name, company, email, country, project_type, budget, message. Required: without it the form cannot submit anywhere useful.',
						},
					],
				},
				{
					type: 'object',
					name: 'asideItems',
					label: 'Contact details',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title }) },
					fields: [
						{ type: 'string', name: 'icon', label: 'Font Awesome icon' },
						{ type: 'string', name: 'title', label: 'Title' },
						{
							type: 'string',
							name: 'description',
							label: 'Description',
							ui: { component: 'textarea' },
						},
					],
				},
			],
		},

		{
			type: 'object',
			name: 'ctaBanner',
			label: 'CTA banner',
			fields: [
				{ type: 'string', name: 'title', label: 'Title' },
				{
					type: 'string',
					name: 'description',
					label: 'Description',
					ui: { component: 'textarea' },
				},
				{ type: 'string', name: 'ctaLabel', label: 'CTA label' },
				{ type: 'string', name: 'ctaHref', label: 'CTA link' },
				{ type: 'string', name: 'ctaIcon', label: 'CTA Font Awesome icon' },
			],
		},

		{
			type: 'object',
			name: 'footer',
			label: 'Footer',
			fields: [
				{ type: 'image', name: 'logo', label: 'Logo' },
				{
					type: 'string',
					name: 'tagline',
					label: 'Tagline',
					ui: { component: 'textarea' },
				},
				{ type: 'string', name: 'columnTitle', label: 'Links column title' },
				{
					type: 'object',
					name: 'links',
					label: 'Links',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.label }) },
					fields: [
						{ type: 'string', name: 'label', label: 'Label' },
						{ type: 'string', name: 'href', label: 'Link' },
					],
				},
				{ type: 'string', name: 'copyright', label: 'Copyright' },
				{ type: 'string', name: 'termsLabel', label: 'Terms link label' },
				{ type: 'string', name: 'termsHref', label: 'Terms link URL' },
				{ type: 'string', name: 'builtWithText', label: 'Built with text' },
				{
					type: 'string',
					name: 'builtWithName',
					label: 'Built with name (e.g. TinaCMS)',
				},
				{ type: 'string', name: 'builtWithHref', label: 'Built with link URL' },
				{ type: 'image', name: 'builtWithLogo', label: 'Built with logo' },
			],
		},
	],
};
