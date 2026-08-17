/**
 * Shared timezone data for the contact form.
 *
 * `TIMEZONE_LABELS` is the source of truth for the option list rendered in
 * src/components/islands/LandingBody.astro. The values in `IANA_TO_LABEL`
 * must be assignable to `TimezoneLabel`, so the TypeScript compiler catches
 * a drift between the map and the option list at build time instead of the
 * old failure mode where a rename silently no-op'd the auto-detect.
 */

export const TIMEZONE_LABELS = [
	'Pacific Time (PT)',
	'Mountain Time (MT)',
	'Central Time (CT)',
	'Eastern Time (ET)',
	'Alaska Time (AKT)',
	'Hawaii Time (HAT)',
	'Atlantic Time (AT)',
	'Newfoundland Time (NT)',
	'Other',
] as const;

export type TimezoneLabel = (typeof TIMEZONE_LABELS)[number];

/**
 * Canonical IANA identifiers → the matching label in `TIMEZONE_LABELS`.
 * Use the short canonical form the runtime actually returns
 * (`America/Indianapolis`, not `America/Indiana/Indianapolis`).
 */
export const IANA_TO_LABEL: Record<string, TimezoneLabel> = {
	// Pacific
	'America/Los_Angeles': 'Pacific Time (PT)',
	'America/Vancouver': 'Pacific Time (PT)',
	'America/Tijuana': 'Pacific Time (PT)',
	// Mountain
	'America/Denver': 'Mountain Time (MT)',
	'America/Edmonton': 'Mountain Time (MT)',
	'America/Phoenix': 'Mountain Time (MT)',
	'America/Boise': 'Mountain Time (MT)',
	'America/Whitehorse': 'Mountain Time (MT)',
	'America/Dawson_Creek': 'Mountain Time (MT)',
	// Central
	'America/Chicago': 'Central Time (CT)',
	'America/Winnipeg': 'Central Time (CT)',
	'America/Regina': 'Central Time (CT)',
	// Eastern
	'America/New_York': 'Eastern Time (ET)',
	'America/Toronto': 'Eastern Time (ET)',
	'America/Detroit': 'Eastern Time (ET)',
	'America/Indianapolis': 'Eastern Time (ET)',
	'America/Louisville': 'Eastern Time (ET)',
	// Alaska
	'America/Anchorage': 'Alaska Time (AKT)',
	// Hawaii-Aleutian
	'Pacific/Honolulu': 'Hawaii Time (HAT)',
	'America/Adak': 'Hawaii Time (HAT)',
	// Atlantic
	'America/Halifax': 'Atlantic Time (AT)',
	'America/Moncton': 'Atlantic Time (AT)',
	'America/Puerto_Rico': 'Atlantic Time (AT)',
	// Newfoundland
	'America/St_Johns': 'Newfoundland Time (NT)',
};
