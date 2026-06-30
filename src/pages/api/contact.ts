/**
 * POST /api/contact
 *
 * Proxies the contact-form submission to Jotform from our Cloudflare Worker
 * instead of letting the browser POST directly. Three reasons:
 *
 *   1. We can read Jotform's response code and surface real success/failure
 *      to the user. The previous iframe-target flow could not distinguish
 *      Jotform's "200 thanks" page from a "400 incomplete values" page —
 *      both fired the iframe's `load` event and the JS marked it success.
 *
 *   2. We can map our flat field names (name, email, company, ...) to
 *      Jotform's per-form question IDs (q10_name10, q4_email, q5_company,
 *      ...). That decouples the markup from whatever Unique Names live on
 *      the Jotform form right now and lets us tolerate Jotform-side renames
 *      without redeploying.
 *
 *   3. Server-side honeypot + required-field validation, so spam bots that
 *      bypass the client-side checks still get rejected before reaching
 *      Jotform.
 *
 * The endpoint accepts both JSON (from the JS-enhanced path) and
 * application/x-www-form-urlencoded (from native form submit when JS is off
 * or fails). It returns JSON on JSON requests and a 303 redirect to
 * /?contact=ok|err#contact on form-encoded requests, so the JS-off path
 * still lands the user back at the contact section with a status hint.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

/** Map our HTML form field names to whatever Jotform calls them server-side.
 *  Driven from the actual Jotform form source (curl https://form.jotform.com/<id>);
 *  re-check this table whenever the form is rebuilt or fields are added. */
const FIELD_MAP: Record<string, string> = {
	name: 'q10_name10',
	email: 'q4_email',
	company: 'q5_company',
	country: 'q6_country',
	project_type: 'q7_projectType',
	budget: 'q8_budget',
	message: 'q9_tellUs',
	// Phone is a plain Short Text on the Jotform form (not a Phone element), so
	// it's a single value, not a composite phoneNumber[full] key. The q-number
	// drifts whenever the field is recreated — re-curl form.jotform.com/<id>
	// after any Jotform-side edit to confirm.
	phone: 'q12_phoneNumber12',
};

const REQUIRED_FIELDS = ['name', 'email', 'company', 'phone', 'country', 'project_type', 'message'];

const HONEYPOT_FIELD = 'website';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const readBody = async (request: Request): Promise<Record<string, string>> => {
	const contentType = request.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		const json = (await request.json().catch(() => ({}))) as Record<string, unknown>;
		const out: Record<string, string> = {};
		for (const [k, v] of Object.entries(json)) {
			if (typeof v === 'string') out[k] = v;
		}
		return out;
	}
	const form = await request.formData();
	const out: Record<string, string> = {};
	for (const [k, v] of form.entries()) {
		if (typeof v === 'string') out[k] = v;
	}
	return out;
};

const wantsJson = (request: Request): boolean => {
	const accept = request.headers.get('accept') ?? '';
	const contentType = request.headers.get('content-type') ?? '';
	return accept.includes('application/json') || contentType.includes('application/json');
};

const json = (status: number, body: Record<string, unknown>) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});

const redirectWithStatus = (status: 'ok' | 'err', origin: string) =>
	new Response(null, {
		status: 303,
		headers: { location: `${origin}/?contact=${status}#contact` },
	});

export const POST: APIRoute = async ({ request, url }) => {
	const respondJson = wantsJson(request);
	const body = await readBody(request);

	// Honeypot — silently 200 on JSON, redirect to ok on form so bots can't tell.
	if (body[HONEYPOT_FIELD]) {
		return respondJson ? json(200, { ok: true }) : redirectWithStatus('ok', url.origin);
	}

	const formId = body.jotformId?.trim();
	if (!formId || !/^\d{12,}$/.test(formId)) {
		return respondJson
			? json(400, { ok: false, error: 'Missing or invalid form ID' })
			: redirectWithStatus('err', url.origin);
	}

	const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim());
	if (missing.length > 0) {
		return respondJson
			? json(400, { ok: false, error: `Missing required fields: ${missing.join(', ')}` })
			: redirectWithStatus('err', url.origin);
	}

	if (!isEmail(body.email!)) {
		return respondJson
			? json(400, { ok: false, error: 'Invalid email address' })
			: redirectWithStatus('err', url.origin);
	}

	if (body.message!.length > 5000) {
		return respondJson
			? json(400, { ok: false, error: 'Message too long' })
			: redirectWithStatus('err', url.origin);
	}

	// Build the payload Jotform expects: x-www-form-urlencoded with their q*
	// field names. Unmapped fields are dropped so we don't leak unexpected
	// keys to Jotform's logger.
	const params = new URLSearchParams();
	for (const [ourKey, value] of Object.entries(body)) {
		const jotformKey = FIELD_MAP[ourKey];
		if (jotformKey && value) params.append(jotformKey, value);
	}

	let jotformResponse: Response;
	try {
		jotformResponse = await fetch(`https://submit.jotform.com/submit/${formId}/`, {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				accept: 'text/html',
				// Jotform's edge sometimes returns 400 if Origin is absent or a generic
				// crawler-like UA hits. Mimicking a browser is the lightest fix.
				'user-agent':
					'Mozilla/5.0 (compatible; SSW-Contact-Form-Proxy/1.0; +https://ssw.com)',
			},
			body: params,
			redirect: 'manual',
		});
	} catch (error) {
		console.error('[contact] fetch to Jotform failed', error);
		return respondJson
			? json(502, { ok: false, error: 'Unable to reach Jotform' })
			: redirectWithStatus('err', url.origin);
	}

	// Jotform returns 200 on the thanks page and follows redirects (3xx) on
	// success in some plans. 4xx means our payload was wrong (e.g. missing a
	// required Jotform field) — log it so the next debug session is faster.
	const ok = jotformResponse.status >= 200 && jotformResponse.status < 400;
	if (!ok) {
		const snippet = await jotformResponse.text().catch(() => '');
		console.error(
			'[contact] Jotform returned non-success',
			jotformResponse.status,
			snippet.slice(0, 400),
		);
	}

	return respondJson
		? json(ok ? 200 : 502, ok ? { ok: true } : { ok: false, error: 'Jotform rejected the submission' })
		: redirectWithStatus(ok ? 'ok' : 'err', url.origin);
};
