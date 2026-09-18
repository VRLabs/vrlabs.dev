import { env } from '$env/dynamic/private';
import { site } from '$lib/config';

function stripTrailingSlash(url: string) {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const apiUrl = stripTrailingSlash(env.API_URL || 'https://api.vrlabs.dev');
export const origin = stripTrailingSlash(env.ORIGIN || site.origin);
export const githubToken = env.GITHUB_TOKEN || null;
