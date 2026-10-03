<script lang="ts">
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

<article class="package">
	<header class="header">
		<h1>{pkg.name}</h1>
		<p class="lead muted">{pkg.description}</p>
	</header>

	<aside class="sidebar" aria-label="Install and details">
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

		<div class="panel">
			<div class="actions">
				{#if data.listing}
					<div class="row">
						<Button onclick={addToVcc} icon={Download} expand>Add to VCC</Button>
						<CopyButton text={data.listing.url} label="Copy listing URL" />
					</div>
				{/if}
				<Button
					variant={inCart ? 'outlined' : 'filled'}
					color={inCart ? 'primary' : 'secondary'}
					expand
					onclick={toggleCart}
					aria-pressed={inCart}
				>
					{inCart ? 'Remove from VCC list' : 'Add to VCC list'}
				</Button>
				{#if pkg.unityPackageUrl || pkg.repoUrl}
					<div class="row">
						{#if pkg.unityPackageUrl}
							<Button
								href={pkg.unityPackageUrl}
								target="_self"
								color="secondary"
								variant="outlined"
								expand
								aria-label="Download {pkg.name} as .unitypackage"
								icon={Download}
							>
								.unitypackage
							</Button>
						{/if}
						{#if pkg.repoUrl}
							<Button href={pkg.repoUrl} color="secondary" variant="outlined" expand icon={Github}>
								GitHub
							</Button>
						{/if}
					</div>
				{/if}
			</div>

			<dl class="details">
				<div>
					<dt>Version</dt>
					<dd>{pkg.version}</dd>
				</div>
				{#if data.stats?.updatedAt}
					<div>
						<dt>Updated</dt>
						<dd><time datetime={data.stats.updatedAt}>{formatDate(data.stats.updatedAt)}</time></dd>
					</div>
				{/if}
				{#if data.stats}
					<div>
						<dt>Downloads</dt>
						<dd>{formatCount(data.stats.downloads)}</dd>
					</div>
				{/if}
				{#if pkg.unity}
					<div>
						<dt>Unity</dt>
						<dd>{pkg.unity}</dd>
					</div>
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

			{#if pkg.dependencies.length}
				<div class="dependencies">
					<h2>Dependencies</h2>
					<ul>
						{#each pkg.dependencies as dependency (dependency)}
							<li><code>{dependency}</code></li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</aside>

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
	.package {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'header' 'sidebar' 'readme';
		gap: var(--s-6);
		padding-block-end: var(--s-16);
	}

	.header {
		grid-area: header;
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		padding-top: var(--s-16);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: var(--font-2xl);
		font-weight: var(--weight-extra);
	}

	.lead {
		font-size: var(--font-lg);
	}

	.sidebar {
		grid-area: sidebar;
		border: var(--border-style);
		border-top-color: var(--color-border-high);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
		overflow: hidden;
		position: static;
	}

	.preview {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-bottom: var(--border-style);
		background-color: var(--color-bg-higher);
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: var(--s-5);
		padding: var(--s-4);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	.row {
		display: flex;
		gap: var(--s-2);
	}

	.details {
		display: flex;
		flex-direction: column;
		font-size: var(--font-sm);

		& > div {
			display: flex;
			justify-content: space-between;
			gap: var(--s-4);
			padding-block: var(--s-2);

			& + div {
				border-top: var(--border-style);
			}
		}
	}

	dt {
		color: var(--color-text-high);
	}

	dd {
		font-weight: var(--weight-extra);
		text-align: end;
	}

	.dependencies {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);

		& h2 {
			font-size: var(--font-2xs);
			font-weight: var(--weight-extra);
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--color-text-high);
		}

		& ul {
			list-style: none;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			gap: var(--s-1);
		}

		& code {
			display: inline-block;
			padding: var(--s-0-5) var(--s-2);
			border-radius: var(--radius-selector);
			background-color: var(--color-bg-higher);
			font-family: var(--font-mono);
			font-size: var(--font-xs);
		}
	}

	.readme {
		grid-area: readme;
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

	@media (min-width: 900px) {
		.package {
			grid-template-columns: minmax(0, 1fr) 20rem;
			grid-template-areas: 'header header' 'readme sidebar';
			align-items: start;
			column-gap: var(--s-4);
		}

		.package:not(:has(.readme)) {
			grid-template-areas: 'header sidebar';
		}

		.sidebar {
			top: var(--layout-sticky-top);
			position: sticky;
		}
	}

	@media (max-width: 640px) {
		.readme {
			padding: var(--s-4);
		}
	}
</style>
