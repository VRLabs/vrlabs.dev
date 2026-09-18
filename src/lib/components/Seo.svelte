<script lang="ts">
	import { site } from '$lib/config';

	interface Props {
		title: string;
		description: string;
		url: string;
		image?: string;
	}

	let { title, description, url, image = site.ogImage }: Props = $props();

	const fullTitle = $derived(title === site.name ? title : `${title} · ${site.name}`);
	const imageUrl = $derived(image.startsWith('/') ? `${site.origin}${image}` : image);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	{#if image === site.ogImage}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
