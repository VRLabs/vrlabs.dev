<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cart, type CartItem } from '$lib/cart.svelte';
	import { createListing, getListing } from '$lib/packages.remote';
	import type { Listing, Package } from '$lib/types';
	import { vcc } from '$lib/vcc.svelte';
	import Button from './Button.svelte';
	import CopyButton from './CopyButton.svelte';
	import Dialog from './Dialog.svelte';
	import Spinner from './Spinner.svelte';

	const dependencyCount = $derived(cart.ids.length - cart.count);

	function close() {
		cart.open = false;
	}

	afterNavigate(close);

	function addToVcc() {
		close();
		void vcc.launch(() => createListing(cart.ids));
	}

	async function listingUrl() {
		const listing = await createListing(cart.ids);
		return listing.url;
	}

	function byId(listing: Listing) {
		const packages = listing.categories.flatMap((category) => category.packages);
		return new Map(packages.map((pkg) => [pkg.id, pkg]));
	}

	function count(value: number, singular: string, plural: string) {
		return `${value} ${value === 1 ? singular : plural}`;
	}
</script>

{#snippet row(item: CartItem, packages: Map<string, Package>)}
	{const pkg = packages.get(item.id)}
	{const name = pkg?.name ?? item.name}
	{const dependencies = pkg?.dependencies ?? item.dependencies}
	<li class="item">
		<div class="info">
			<div class="title">
				<a href={resolve('/packages/[id]', { id: item.id })}>{name}</a>
				{#if pkg}
					<span class="badge">{pkg.version}</span>
				{:else}
					<span class="badge" title="This package is not in the listing anymore">Not listed</span>
				{/if}
			</div>
			{#if dependencies.length}
				<p class="dependencies muted">
					Depends on {dependencies.map((id) => packages.get(id)?.name ?? id).join(', ')}
				</p>
			{/if}
		</div>
		<Button
			variant="ghost"
			color="destructive"
			size="small"
			square
			onclick={() => cart.remove(item.id)}
			aria-label="Remove {name} from the list"
			title="Remove"
			icon={Trash2}
		/>
	</li>
{/snippet}

{#snippet items(packages: Map<string, Package>)}
	<ul class="items">
		{#each cart.items as item (item.id)}
			{@render row(item, packages)}
		{/each}
	</ul>
{/snippet}

<Dialog open={cart.open} title="VCC list" fill onclose={close}>
	{#if cart.open}
		{#if cart.count === 0}
			<div class="empty">
				<img src="/images/idle.webp" alt="" width="96" height="96" />
				<p class="muted">You have no packages selected.</p>
				<Button href={resolve('/packages')} color="secondary" round onclick={close}>
					Browse packages
				</Button>
			</div>
		{:else}
			<svelte:boundary>
				{const packages = byId(await getListing())}
				{@render items(packages)}

				{#snippet pending()}
					<Spinner size="6rem" label="Loading packages" />
				{/snippet}

				{#snippet failed()}
					{@render items(new Map())}
				{/snippet}
			</svelte:boundary>
		{/if}
	{/if}

	{#snippet footer()}
		<div class="actions">
			<Button expand disabled={cart.count === 0 || vcc.loading} onclick={addToVcc} icon={Download}>
				Add to VCC
			</Button>
			<CopyButton text={listingUrl} label="Copy listing URL" disabled={cart.count === 0} />
			<Button
				variant="ghost"
				color="destructive"
				square
				disabled={cart.count === 0}
				onclick={() => cart.clear()}
				aria-label="Clear the list"
				title="Clear the list"
				icon={Trash2}
			/>
		</div>
		<p class="summary muted">
			{#if cart.count === 0}
				Nothing to add yet.
			{:else}
				{count(cart.count, 'package', 'packages')}
				{#if dependencyCount}
					and {count(dependencyCount, 'dependency', 'dependencies')}
				{/if}
				will be added to the listing.
			{/if}
		</p>
	{/snippet}
</Dialog>

<style>
	.empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--s-4);
		text-align: center;
	}

	.items {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	.item {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3) var(--s-4);
		border: var(--border-style);
		border-radius: var(--radius-field);
		background-color: var(--color-bg-high);
	}

	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	.title {
		display: flex;
		align-items: center;
		gap: var(--s-2);

		& a {
			color: var(--color-text);
			font-weight: var(--weight-extra);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&:hover {
				color: var(--color-text-accent);
				text-decoration: none;
			}
		}
	}

	.dependencies {
		font-size: var(--font-xs);
	}

	.summary {
		font-size: var(--font-xs);
	}

	.actions {
		display: flex;
		gap: var(--s-2);
	}
</style>
