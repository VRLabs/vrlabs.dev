<script lang="ts">
	import { getReadme } from '$lib/packages.remote';
	import type { Package } from '$lib/types';
	import Button from './Button.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Dialog from './Dialog.svelte';
	import Spinner from './Spinner.svelte';

	import '../../styles/markdown.css';

	interface Props {
		pkg: Package | null;
		onclose: () => void;
	}

	let { pkg, onclose }: Props = $props();
</script>

<Dialog open={pkg !== null} title={pkg ? `${pkg.name} README` : ''} size="large" {onclose}>
	{#snippet actions()}
		{#if pkg?.repoUrl}
			<Button href={pkg.repoUrl} variant="ghost" color="secondary" size="small" icon={ExternalLink}>
				GitHub
			</Button>
		{/if}
	{/snippet}

	{#if pkg?.repo}
		{#key pkg.repo}
			<svelte:boundary>
				{const html = await getReadme(pkg.repo)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="markdown">{@html html}</div>

				{#snippet pending()}
					<Spinner label="Loading README" />
				{/snippet}

				{#snippet failed(_error, reset)}
					<div class="failed">
						<img src="/images/cry.webp" alt="" width="96" height="96" />
						<p class="muted">The README could not be loaded.</p>
						<Button color="secondary" round onclick={reset}>Try again</Button>
					</div>
				{/snippet}
			</svelte:boundary>
		{/key}
	{/if}
</Dialog>

<style>
	.failed {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		padding-block: var(--s-6);
	}
</style>
