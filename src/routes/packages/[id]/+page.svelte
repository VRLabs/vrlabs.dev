<script lang="ts">
	import { resolve } from '$app/paths';
	import { cart } from '$lib/cart.svelte';
	import Button from '$lib/components/Button.svelte';
	import Download from '@lucide/svelte/icons/download';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Github from '$lib/icons/Github.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { site } from '$lib/config';
	import { formatCount, formatDate, questLabels } from '$lib/format';
	import { getPackage, getReadme } from '$lib/packages.remote';
	import { vcc } from '$lib/vcc.svelte';
	import type { PageProps } from './$types';

	import '../../../styles/markdown.css';

	let { params }: PageProps = $props();

	const data = $derived(await getPackage(params.id));
	const pkg = $derived(data.pkg);
	const inCart = $derived(cart.has(pkg.id));

	const embedTag = $derived(
		`<script id="discord:component-embed" type="application/json">${data.embed}</` + 'script>'
	);

	function toggleCart() {
		if (inCart) cart.remove(pkg.id);
		else cart.add(pkg);
	}

	function addToVcc() {
		const listing = data.listing;
		if (listing) void vcc.launch(async () => listing);
	}
</script>

<Seo
	title={pkg.name}
	description={pkg.description || `${pkg.name} by VRLabs`}
	image={pkg.previewImage ?? site.ogImage}
/>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html embedTag}
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href={resolve('/packages')}>Packages</a>
	<span aria-hidden="true">/</span>
	<a href="{resolve('/packages')}#category-{data.category.id}">{data.category.name}</a>
</nav>

<article class="package">
	<header class="hero">
		{#if pkg.previewGif ?? pkg.previewImage}
			<img
				class="preview"
				src={pkg.previewGif ?? pkg.previewImage}
				alt="Preview of {pkg.name}"
				width="640"
				height="360"
				loading="eager"
			/>
		{/if}
		<div class="summary">
			<h1>{pkg.name}</h1>
			<p class="lead muted">{pkg.description}</p>
			<dl class="facts">
				<div>
					<dt>Version</dt>
					<dd>{pkg.version}</dd>
				</div>
				{#if pkg.unity}
					<div>
						<dt>Unity</dt>
						<dd>{pkg.unity}</dd>
					</div>
				{/if}
				{#if data.stats}
					<div>
						<dt>Downloads</dt>
						<dd>{formatCount(data.stats.downloads)}</dd>
					</div>
					{#if data.stats.updatedAt}
						<div>
							<dt>Updated</dt>
							<dd>{formatDate(data.stats.updatedAt)}</dd>
						</div>
					{/if}
				{/if}
				{#if pkg.quest !== 'unknown'}
					<div>
						<dt>Quest</dt>
						<dd>{questLabels[pkg.quest]}</dd>
					</div>
				{/if}
				{#if pkg.license}
					<div>
						<dt>License</dt>
						<dd>{pkg.license}</dd>
					</div>
				{/if}
			</dl>
			<div class="actions">
				{#if data.listing}
					<Button size="large" onclick={addToVcc} icon={Download}>Add to VCC</Button>
					<CopyButton text={data.listing.url} label="Copy listing URL" size="large" />
				{/if}
				<Button
					variant={inCart ? 'outlined' : 'filled'}
					color={inCart ? 'primary' : 'secondary'}
					size="large"
					onclick={toggleCart}
					aria-pressed={inCart}
				>
					{inCart ? 'Remove from VCC list' : 'Add to VCC list'}
				</Button>
				{#if pkg.unityPackageUrl}
					<Button href={pkg.unityPackageUrl} target="_self" color="secondary" size="large">
						Download .unitypackage
					</Button>
				{/if}
				{#if pkg.repoUrl}
					<Button href={pkg.repoUrl} color="secondary" size="large" icon={Github}>GitHub</Button>
				{/if}
			</div>
			{#if pkg.dependencies.length}
				<p class="dependencies muted">
					Depends on
					{#each pkg.dependencies as dependency, i (dependency)}
						<code>{dependency}</code>{i < pkg.dependencies.length - 1 ? ', ' : ''}
					{/each}
				</p>
			{/if}
		</div>
	</header>

	{#if pkg.repo}
		<section class="readme" aria-labelledby="readme-title">
			<h2 id="readme-title">README</h2>
			<svelte:boundary>
				{const html = await getReadme(pkg.repo)}

				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="markdown">{@html html}</div>

				{#snippet pending()}
					<Spinner label="Loading README" />
				{/snippet}

				{#snippet failed(_error, reset)}
					<div class="failed">
						<p class="muted">The README could not be loaded.</p>
						<Button color="secondary" round onclick={reset}>Try again</Button>
					</div>
				{/snippet}
			</svelte:boundary>
		</section>
	{/if}
</article>

<style>
	.breadcrumb {
		display: flex;
		gap: var(--s-2);
		padding-block: var(--s-6);
		font-size: var(--font-sm);
		font-weight: var(--weight-extra);
		color: var(--color-text-high);
	}

	.package {
		display: flex;
		flex-direction: column;
		gap: var(--s-8);
		padding-block-end: var(--s-16);
	}

	.hero {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
		padding: var(--s-6);
		border: var(--border-style);
		border-top-color: var(--color-border-high);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.preview {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: var(--radius-field);
		background-color: var(--color-bg-higher);
	}

	.summary {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: var(--font-2xl);
		font-weight: var(--weight-extra);
	}

	.lead {
		font-size: var(--font-lg);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(7rem, max-content));
		gap: var(--s-3) var(--s-8);

		& > div {
			display: flex;
			flex-direction: column;
		}
	}

	dt {
		font-size: var(--font-2xs);
		font-weight: var(--weight-extra);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-text-high);
	}

	dd {
		font-size: var(--font-md);
		font-weight: var(--weight-extra);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
	}

	.dependencies {
		font-size: var(--font-xs);

		& code {
			font-family: var(--font-mono);
		}
	}

	.readme {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
		padding: var(--s-6);
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg);

		& h2 {
			font-size: var(--font-xl);
			font-weight: var(--weight-extra);
			padding-block-end: var(--s-2);
			border-bottom: var(--border-style);
		}
	}

	.failed {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		padding-block: var(--s-6);
	}

	@media (min-width: 768px) {
		.hero {
			display: grid;
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.hero,
		.readme {
			padding: var(--s-4);
		}

		.actions > :global(*) {
			flex: 1;
		}
	}
</style>
