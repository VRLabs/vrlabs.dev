import { categoryOrder } from '$lib/config';
import type { ApiPackage, Category, CustomListing, Listing, Package } from '$lib/types';
import { TtlCache, durations } from './cache';
import { apiUrl } from './env';

const requestTimeoutMs = 8000;
const listingCache = new TtlCache<Listing>(durations.packages, durations.failure);

export function vccAddRepoUrl(listingUrl: string) {
	return `vcc://vpm/addRepo?url=${encodeURIComponent(listingUrl)}`;
}

function isHttpUrl(value: string | undefined): value is string {
	return !!value && /^https?:\/\/\S+$/i.test(value);
}

function githubRepo(url: string | null) {
	const match = url?.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/i);
	return match ? match[1] : null;
}

function normalizePackage(raw: ApiPackage): Package {
	const info = raw.packageInfo;
	const repoUrl = isHttpUrl(info.siteUrl) ? info.siteUrl : null;

	return {
		id: raw.name,
		name: info.displayName || raw.name,
		description: info.description ?? '',
		category: raw.category.toLowerCase(),
		version: raw.latestVersion || info.version,
		unity: info.unity ?? null,
		license: info.license ?? null,
		repoUrl,
		repo: githubRepo(repoUrl),
		zipUrl: isHttpUrl(info.url) ? info.url : null,
		unityPackageUrl: isHttpUrl(info.unityPackageUrl) ? info.unityPackageUrl : null,
		previewImage: isHttpUrl(info.media?.previewImage) ? info.media.previewImage : null,
		previewGif: isHttpUrl(info.media?.previewGif) ? info.media.previewGif : null,
		quest: info.questCompatibility ?? 'none',
		dependencies: Object.keys(info.vpmDependencies ?? {}),
		keywords: info.keywords ?? []
	};
}

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function categoryListingUrl(categoryId: string) {
	return `${apiUrl}/listings/category/${encodeURIComponent(categoryId)}`;
}

function groupByCategory(packages: Package[]): Category[] {
	const groups = new Map<string, Package[]>();
	for (const pkg of packages) {
		const group = groups.get(pkg.category) ?? [];
		group.push(pkg);
		groups.set(pkg.category, group);
	}

	const categories = [...groups.entries()].map(([id, packages]) => {
		const listingUrl = categoryListingUrl(id);
		return { id, name: capitalize(id), packages, listingUrl, vccUrl: vccAddRepoUrl(listingUrl) };
	});

	return categories.sort((a, b) => {
		const aIndex = categoryOrder.indexOf(a.id);
		const bIndex = categoryOrder.indexOf(b.id);
		if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
		if (aIndex === -1) return 1;
		if (bIndex === -1) return -1;
		return aIndex - bIndex;
	});
}

async function fetchListing(): Promise<Listing> {
	const response = await fetch(`${apiUrl}/packages/info`, {
		signal: AbortSignal.timeout(requestTimeoutMs)
	});
	if (!response.ok) throw new Error(`Package API responded with ${response.status}`);

	const raw = (await response.json()) as Record<string, ApiPackage>;
	const packages = Object.values(raw)
		.filter((entry) => entry?.packageInfo)
		.map(normalizePackage);

	return { categories: groupByCategory(packages), fetchedAt: new Date().toISOString() };
}

export function getListing() {
	return listingCache.get('listing', fetchListing);
}

export async function findPackage(id: string) {
	const { categories } = await getListing();
	for (const category of categories) {
		const pkg = category.packages.find((entry) => entry.id === id);
		if (pkg) return { pkg, category };
	}
	return null;
}

export async function listedRepos() {
	const { categories } = await getListing();
	const repos = categories.flatMap((category) => category.packages.map((pkg) => pkg.repo));
	return new Set(repos.filter((repo): repo is string => repo !== null));
}

export async function listablePackageIds() {
	const { categories } = await getListing();
	return new Set(
		categories.flatMap((category) =>
			category.packages.flatMap((pkg) => [pkg.id, ...pkg.dependencies])
		)
	);
}

const customListingCache = new TtlCache<CustomListing>(durations.packages, durations.failure);

export function createListing(ids: string[]): Promise<CustomListing> {
	const key = [...new Set(ids)].sort().join(',');
	return customListingCache.get(key, () => encodeListing(key.split(',')));
}

async function encodeListing(ids: string[]): Promise<CustomListing> {
	const response = await fetch(`${apiUrl}/listings/encode`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(ids),
		signal: AbortSignal.timeout(requestTimeoutMs)
	});
	if (!response.ok) throw new Error(`Package API responded with ${response.status}`);

	const { message } = (await response.json()) as { message?: string };
	if (!message) throw new Error('Package API returned no listing ID');

	const url = `${apiUrl}/listings/ids/${message}`;
	return { url, vccUrl: vccAddRepoUrl(url) };
}
