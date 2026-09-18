<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import { site } from '$lib/config';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		notFound
			? page.error?.message === 'Package not found'
				? 'This package does not exist or is no longer listed.'
				: 'The page you are looking for does not exist.'
			: 'The packages could not be loaded right now. Please try again later.'
	);
</script>

<svelte:head>
	<title>{title} · {site.name}</title>
</svelte:head>

<div class="error">
	<img src="/images/cry.webp" alt="" width="192" height="192" loading="eager" />
	<h1>{title}</h1>
	<p class="muted">{message}</p>
	<div class="actions">
		{#if notFound}
			<Button variant="secondary" size="large" round onclick={() => history.back()}>Go back</Button>
			<Button href="/" size="large" round>Home</Button>
		{:else}
			<Button size="large" round onclick={() => location.reload()}>Try again</Button>
		{/if}
	</div>
</div>

<style>
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		padding-block: var(--s-16);
		text-align: center;
	}

	img {
		width: 9rem;
		height: 9rem;
	}

	h1 {
		font-size: var(--font-xl);
		font-weight: var(--weight-extra);
	}

	.actions {
		display: flex;
		gap: var(--s-2);
		margin-block-start: var(--s-2);
	}

	@media (min-width: 640px) {
		img {
			width: 12rem;
			height: 12rem;
		}
	}
</style>
