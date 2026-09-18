import type { PackageStats } from '$lib/types';
import { TtlCache, durations, type RetryAfterError } from './cache';
import { githubToken } from './env';

const requestTimeoutMs = 8000;
const statsCache = new TtlCache<PackageStats>(durations.stats, durations.failure);

let rateLimitedUntil = 0;

interface Release {
	published_at: string | null;
	draft: boolean;
	assets: { download_count: number }[];
}

function headers() {
	const result: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'User-Agent': 'vrlabs.dev'
	};
	if (githubToken) result.Authorization = `Bearer ${githubToken}`;
	return result;
}

function rateLimitReset(response: Response) {
	const retryAfter = Number(response.headers.get('retry-after'));
	if (retryAfter > 0) return Date.now() + retryAfter * 1000;

	const reset = Number(response.headers.get('x-ratelimit-reset'));
	if (response.headers.get('x-ratelimit-remaining') === '0' && reset > 0) return reset * 1000;

	return 0;
}

function rateLimitError(repo: string, until: number) {
	const error: RetryAfterError = new Error(
		`GitHub rate limit reached for ${repo}, retrying after ${new Date(until).toISOString()}`
	);
	error.retryAt = until;
	return error;
}

async function fetchStats(repo: string): Promise<PackageStats> {
	if (Date.now() < rateLimitedUntil) throw rateLimitError(repo, rateLimitedUntil);

	const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
		headers: headers(),
		signal: AbortSignal.timeout(requestTimeoutMs)
	});

	if (response.status === 403 || response.status === 429) {
		const until = rateLimitReset(response);
		if (until) {
			rateLimitedUntil = until;
			throw rateLimitError(repo, until);
		}
	}
	if (!response.ok) throw new Error(`GitHub responded with ${response.status} for ${repo}`);

	const releases = ((await response.json()) as Release[]).filter((release) => !release.draft);
	const downloads = releases
		.flatMap((release) => release.assets)
		.reduce((sum, asset) => sum + asset.download_count, 0);

	return { downloads, updatedAt: releases[0]?.published_at ?? null };
}

export function getStats(repo: string) {
	return statsCache.get(repo, () => fetchStats(repo));
}

export function getStatsOrNull(repo: string, timeoutMs: number) {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const timeout = new Promise<null>((resolve) => {
		timer = setTimeout(() => resolve(null), timeoutMs);
	});

	return Promise.race([getStats(repo).catch(() => null), timeout]).finally(() =>
		clearTimeout(timer)
	);
}
