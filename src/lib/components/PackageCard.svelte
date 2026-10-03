<script lang="ts">
	import CalendarSync from '@lucide/svelte/icons/calendar-sync';
	import Download from '@lucide/svelte/icons/download';
	import Image from '@lucide/svelte/icons/image';
	import Info from '@lucide/svelte/icons/info';
	import Tag from '@lucide/svelte/icons/tag';
	import { resolve } from '$app/paths';
	import { cart } from '$lib/cart.svelte';
	import { formatCount, formatDate, questLabels } from '$lib/format';
	import Github from '$lib/icons/Github.svelte';
	import Meta from '$lib/icons/Meta.svelte';
	import { getStats } from '$lib/packages.remote';
	import type { Package } from '$lib/types';
	import Button from './Button.svelte';

	interface Props {
		pkg: Package;
		onInfo: (pkg: Package) => void;
	}

	let { pkg, onInfo }: Props = $props();

	let hovering = $state(false);
	let gifRequested = $state(false);
	let gifLoaded = $state(false);
	let imageLoaded = $state(false);

	const showGif = $derived(hovering && gifLoaded);
	const inCart = $derived(cart.has(pkg.id));

	function trackLoaded(setLoaded: () => void) {
		return (img: HTMLImageElement) => {
			if (img.complete && img.naturalWidth > 0) setLoaded();
		};
	}

	function requestGif() {
		hovering = true;
		if (pkg.previewGif) gifRequested = true;
	}

	function toggleCart() {
		if (inCart) cart.remove(pkg.id);
		else cart.add(pkg);
	}
</script>

{#snippet downloads(count: string)}
	<span class="fact">
		<Download size={16} aria-hidden="true" />
		<span>{count}</span>
		<span class="visually-hidden">downloads</span>
	</span>
{/snippet}

<article
	class="card"
	onpointerenter={requestGif}
	onpointerleave={() => (hovering = false)}
	onfocusin={requestGif}
	onfocusout={() => (hovering = false)}
>
	<div class="media">
		{#if pkg.previewImage}
			<img
				class={['preview', imageLoaded && 'loaded']}
				src={pkg.previewImage}
				alt=""
				loading="lazy"
				onload={() => (imageLoaded = true)}
				{@attach trackLoaded(() => (imageLoaded = true))}
			/>
			{#if pkg.previewGif && gifRequested}
				<img
					class={['gif', showGif && 'visible']}
					src={pkg.previewGif}
					alt=""
					onload={() => (gifLoaded = true)}
					{@attach trackLoaded(() => (gifLoaded = true))}
				/>
			{/if}
		{:else}
			<div class="placeholder"><Image size={64} strokeWidth={1.5} aria-hidden="true" /></div>
		{/if}
		<div class="corner start">
			<Button
				color="secondary"
				size="small"
				square
				round
				disabled={!pkg.repo}
				onclick={() => onInfo(pkg)}
				aria-label="Show README of {pkg.name}"
				title="README"
				icon={Info}
				style="--button-icon-size: 24px"
			/>
			{#if pkg.repoUrl}
				<Button
					href={pkg.repoUrl}
					color="secondary"
					size="small"
					square
					round
					aria-label="Open the GitHub repository of {pkg.name}"
					title="GitHub"
					icon={Github}
					style="--button-icon-size: 24px"
				/>
			{/if}
			{#if pkg.quest === 'full' || pkg.quest === 'partial'}
				<span class={['quest', pkg.quest]} title={questLabels[pkg.quest]}>
					<Meta size={18} />
					<span class="visually-hidden">{questLabels[pkg.quest]}</span>
				</span>
			{/if}
		</div>
		{#if pkg.previewGif}
			<span class="badge corner end" aria-hidden="true">GIF</span>
		{/if}
	</div>

	<div class="body">
		<div class="content">
			<h3><a href={resolve('/packages/[id]', { id: pkg.id })}>{pkg.name}</a></h3>
			<p class="meta muted">
				<span class="fact">
					<Tag size={16} aria-hidden="true" />
					<span class="visually-hidden">Version</span>
					<span>{pkg.version}</span>
				</span>
				{#if pkg.repo}
					<svelte:boundary>
						{const stats = await getStats(pkg.repo)}
						{@render downloads(stats ? formatCount(stats.downloads) : '—')}
						{#if stats?.updatedAt}
							<span class="fact">
								<CalendarSync size={16} aria-hidden="true" />
								<span class="visually-hidden">Updated</span>
								<time datetime={stats.updatedAt}>{formatDate(stats.updatedAt)}</time>
							</span>
						{/if}
						{#snippet pending()}
							<span class="fact">
								<Download size={16} aria-hidden="true" />
								<span class="skeleton" role="status" aria-label="Loading download count"></span>
							</span>
						{/snippet}
						{#snippet failed()}
							{@render downloads('—')}
						{/snippet}
					</svelte:boundary>
				{:else}
					{@render downloads('—')}
				{/if}
			</p>
			<p class="description muted">{pkg.description}</p>
		</div>
		<div class="actions">
			<Button
				variant={inCart ? 'outlined' : 'filled'}
				expand
				onclick={toggleCart}
				aria-pressed={inCart}
			>
				{inCart ? 'Remove from VCC list' : 'Add to VCC list'}
			</Button>
			{#if pkg.unityPackageUrl}
				<Button
					href={pkg.unityPackageUrl}
					target="_self"
					color="secondary"
					square
					aria-label="Download {pkg.name} as .unitypackage"
					title="Download .unitypackage"
					icon={Download}
				/>
			{/if}
		</div>
	</div>
</article>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
		overflow: hidden;
		transition: transform var(--duration);

		&:hover,
		&:has(:focus-visible) {
			transform: scale(1.02);
		}
	}

	.media {
		position: relative;
		height: 11rem;
		background-color: var(--color-bg-higher);
	}

	.preview,
	.gif {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity var(--duration);
	}

	.preview.loaded {
		opacity: 1;
	}

	.gif.visible {
		opacity: 1;
	}

	.media:not(:has(.preview.loaded)):has(.preview) {
		background-image: linear-gradient(
			to right,
			transparent 0%,
			color-mix(in oklch, var(--color-text) 6%, transparent) 50%,
			transparent 100%
		);
		background-size: 200% 100%;
		animation: shimmer 2s linear infinite;
	}

	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	.placeholder {
		height: 100%;
		display: grid;
		place-items: center;
		color: var(--color-border-high);
	}

	.corner {
		position: absolute;
		z-index: 1;
		top: var(--s-2);
		display: flex;
		align-items: center;
		gap: var(--s-2);
	}

	.corner.start {
		left: var(--s-2);
	}

	.corner.end {
		right: var(--s-2);
	}

	.quest {
		display: grid;
		place-items: center;
		width: var(--field-size-sm);
		height: var(--field-size-sm);
		border-radius: var(--radius-full);
		background-color: var(--color-bg-high);
		border: 2px solid var(--color-bg-high);

		&.full {
			border-color: var(--color-success);
			background-color: var(--color-success-low);
			color: var(--color-success-high);
		}

		&.partial {
			border-color: var(--color-warning);
			background-color: var(--color-warning-low);
			color: var(--color-warning-high);
		}
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.content {
		padding: var(--s-3);
	}

	h3 {
		font-size: var(--font-lg);
		font-weight: var(--weight-extra);

		& a {
			color: inherit;

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: var(--radius-box);
			}

			&:hover {
				color: var(--color-text-accent);
				text-decoration: none;
			}

			&:focus-visible {
				outline: none;

				&::after {
					outline: var(--focus-ring);
					outline-offset: -2px;
				}
			}
		}
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 var(--s-2);
		min-height: 1lh;
		font-size: var(--font-2xs);
		margin-top: var(--s-1);
	}

	.fact {
		display: flex;
		align-items: center;
		gap: var(--s-1);
		height: 1lh;
	}

	.skeleton {
		display: inline-block;
		width: var(--s-12);
		height: var(--font-xs);
		border-radius: var(--radius-selector);
		background-color: var(--color-bg-higher);
	}

	.description {
		font-size: var(--font-xs);
		margin-top: var(--s-3);
	}

	.actions {
		position: relative;
		z-index: 5;
		display: flex;
		gap: var(--s-2);
		margin-block-start: auto;
		border-top: var(--border-style);
		padding: var(--s-3);
	}

	@media (prefers-reduced-motion: reduce) {
		.card:hover,
		.card:has(:focus-visible) {
			transform: none;
		}
	}
</style>
