<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	import '../styles/normalize.css';
	import '../styles/vars.css';
	import '../styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="keywords" content="VRChat, Unity, Packages, Avatars" />
</svelte:head>

<Header />
<main id="main" class="main">
	{@render children()}
</main>
<Footer />

<style>
	.main {
		width: 100%;
		max-width: var(--layout-max-width);
		min-height: calc(100dvh - var(--layout-nav-height));
		margin-inline: auto;
		padding-inline: var(--layout-page-padding);
		background: radial-gradient(
			600px 100px at 50% 0,
			color-mix(in oklch, var(--color-text-accent) 10%, transparent) 0%,
			transparent 100%
		);
	}

	@media (min-width: 640px) {
		.main {
			padding-inline: var(--s-10);
		}
	}
</style>
