import { env } from '$env/dynamic/private';

function stripTrailingSlash(url: string) {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const apiUrl = stripTrailingSlash(env.API_URL || 'https://api.vrlabs.dev');
export const githubToken = env.GITHUB_TOKEN || null;
