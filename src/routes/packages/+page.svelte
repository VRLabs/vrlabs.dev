<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cart } from '$lib/cart.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import CategoryHeader from '$lib/components/CategoryHeader.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import PackageCard from '$lib/components/PackageCard.svelte';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import ReadmeDialog from '$lib/components/ReadmeDialog.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import VccDialog from '$lib/components/VccDialog.svelte';
	import { filterCategories, type QuestFilter } from '$lib/filters';
	import { listParam } from '$lib/format';
	import { createListing, getCategoryListing, getListing, getStats } from '$lib/packages.remote';
	import { needsStats, sortPackages, type SortKey, type StatsMap } from '$lib/sort';
	import type { Package } from '$lib/types';
	import { vcc } from '$lib/vcc.svelte';

	const listing = await getListing();
	const packages = listing.categories.flatMap((category) => category.packages);

	let query = $state('');
	let category = $state('all');
	let quest = $state<QuestFilter>('any');
	let sort = $state<SortKey>('default');
	let readmePkg = $state<Package | null>(null);

	async function loadStats(): Promise<StatsMap | null> {
		try {
			const entries = await Promise.all(
				packages
					.filter((pkg) => pkg.repo)
					.map(async (pkg) => [pkg.id, await getStats(pkg.repo!)] as const)
			);
			return new Map(entries);
		} catch (error) {
			console.error('Could not load download counts', error);
			return null;
		}
	}

	const stats = $derived(needsStats(sort) ? await loadStats() : null);
	const categories = $derived(
		filterCategories(listing.categories, { query, category, quest }).map((entry) => ({
			...entry,
			packages: sortPackages(entry.packages, sort, stats)
		}))
	);
	const count = $derived(categories.reduce((sum, entry) => sum + entry.packages.length, 0));

	function findPackage(id: string) {
		return packages.find((pkg) => pkg.id === id);
	}

	onMount(() => {
		const params = page.url.searchParams;
		const packageIds = listParam(params, 'package');
		const categoryIds = listParam(params, 'category').map((id) => id.toLowerCase());
		const cartIds = listParam(params, 'cart');
		if (!packageIds.length && !categoryIds.length && !cartIds.length) return;

		replaceState(resolve('/packages'), page.state);

		for (const id of cartIds) {
			const pkg = findPackage(id);
			if (pkg) cart.add(pkg);
		}
		if (cartIds.length) cart.open = true;

		const selectedCategories = listing.categories.filter((entry) => categoryIds.includes(entry.id));
		if (!packageIds.length && selectedCategories.length === 1) {
			void vcc.launch(() => getCategoryListing(selectedCategories[0].id));
			return;
		}

		const selected = [
			...packageIds.map(findPackage),
			...selectedCategories.flatMap((entry) => entry.packages)
		];
		const ids = selected.flatMap((pkg) => (pkg ? [...pkg.dependencies, pkg.id] : []));
		if (ids.length) void vcc.launch(() => createListing(ids));
	});
</script>

<Seo title="Packages" description="A list of all our publicly available packages" />

<PageHeading title="Packages" description="A list of all our publicly available packages" />

<Filters categories={listing.categories} bind:query bind:category bind:quest bind:sort {count} />

<div class="categories">
	{#each categories as entry (entry.id)}
		<section aria-labelledby="category-{entry.id}">
			<CategoryHeader category={entry} />
			<ul class="grid">
				{#each entry.packages as pkg (pkg.id)}
					<li><PackageCard {pkg} onInfo={(selected) => (readmePkg = selected)} /></li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="empty">
			<img src="/images/cry.webp" alt="" width="128" height="128" loading="lazy" />
			<p class="muted">No packages match your search.</p>
		</div>
	{/each}
</div>

<ReadmeDialog pkg={readmePkg} onclose={() => (readmePkg = null)} />
<VccDialog
	listing={vcc.listing}
	loading={vcc.loading}
	error={vcc.error}
	onclose={() => vcc.close()}
/>
<CartDrawer />

<style>
	.categories {
		display: flex;
		flex-direction: column;
		gap: var(--s-16);
		padding-block: var(--s-8) var(--s-24);
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--s-8);
	}

	.grid {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
		gap: var(--s-12) var(--s-8);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		padding-block: var(--s-8);
	}

	.empty img {
		width: var(--s-32);
		height: var(--s-32);
	}
</style>
