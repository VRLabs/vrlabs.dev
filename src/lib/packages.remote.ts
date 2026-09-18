import { error } from '@sveltejs/kit';
import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';
import { buildPackageEmbed } from './embed/package';
import { serializeEmbed } from './embed/components';
import {
	categoryListingUrl,
	createListing as createListingViaApi,
	findPackage,
	getListing as getListingFromApi,
	listablePackageIds,
	listedRepos,
	vccAddRepoUrl
} from './server/api';
import { getReadme as fetchReadme } from './server/readme';
import { getStatsOrNull } from './server/github';
import type { CustomListing, PackageStats } from './types';

const embedStatsTimeoutMs = 4000;
const statsTimeoutMs = 8000;

const packageId = v.pipe(v.string(), v.regex(/^[a-z0-9.-]+$/i), v.maxLength(100));
const repoName = v.pipe(v.string(), v.regex(/^[\w.-]+\/[\w.-]+$/));

export const getListing = query(getListingFromApi);

export const getPackage = query(packageId, async (id) => {
	const found = await findPackage(id);
	if (!found) error(404, 'Package not found');

	const { pkg, category } = found;
	const [stats, listing] = await Promise.all([
		pkg.repo ? getStatsOrNull(pkg.repo, embedStatsTimeoutMs) : null,
		createListingViaApi([...pkg.dependencies, pkg.id]).catch((): null => null)
	]);

	const { origin } = getRequestEvent().url;
	const pageUrl = `${origin}/packages/${encodeURIComponent(pkg.id)}`;
	const addToVccUrl = `${origin}/packages?package=${encodeURIComponent(pkg.id)}`;
	const embed = serializeEmbed(
		buildPackageEmbed(pkg, stats, { page: pageUrl, addToVcc: addToVccUrl })
	);

	return { pkg, category, stats, listing, embed };
});

export const getStats = query.batch(repoName, async (repos) => {
	const listed = await listedRepos();
	const results = await Promise.all(
		repos.map((repo) => (listed.has(repo) ? getStatsOrNull(repo, statsTimeoutMs) : null))
	);

	const lookup = new Map<string, PackageStats | null>(repos.map((repo, i) => [repo, results[i]]));
	return (repo) => lookup.get(repo) ?? null;
});

export const getReadme = query(repoName, async (repo) => {
	const listed = await listedRepos();
	if (!listed.has(repo)) error(404, 'Repository not found');

	return fetchReadme(repo);
});

export const createListing = query(
	v.pipe(v.array(packageId), v.minLength(1), v.maxLength(100)),

	async (ids): Promise<CustomListing> => {
		const listable = await listablePackageIds();
		const known = [...new Set(ids)].filter((id) => listable.has(id));

		if (!known.length) error(400, 'None of the packages are listed');
		return createListingViaApi(known);
	}
);

export const getCategoryListing = query(
	v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/i)),

	async (categoryId): Promise<CustomListing> => {
		const url = categoryListingUrl(categoryId.toLowerCase());
		return { url, vccUrl: vccAddRepoUrl(url) };
	}
);
