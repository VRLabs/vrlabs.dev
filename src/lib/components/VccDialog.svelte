<script lang="ts">
	import type { CustomListing } from '$lib/types';
	import Button from './Button.svelte';
	import CopyButton from './CopyButton.svelte';
	import Dialog from './Dialog.svelte';
	import Input from './Input.svelte';

	interface Props {
		listing: CustomListing | null;
		loading?: boolean;
		error?: string | null;
		title?: string;
		onclose: () => void;
	}

	let {
		listing,
		loading = false,
		error = null,
		title = 'Adding to the Creator Companion',
		onclose
	}: Props = $props();
</script>

<Dialog open={loading || !!listing || !!error} {title} {onclose}>
	{#if error}
		<p class="muted">{error}</p>
	{:else if loading || !listing}
		<p class="muted" aria-live="polite">Creating the package listing…</p>
	{:else}
		<p class="muted">
			The VRChat Creator Companion should open by itself. If it did not, open it with the button
			below or add the listing URL by hand under <strong
				>Settings › Packages › Add Repository</strong
			>.
		</p>
		<div class="row">
			<Input value={listing.url} readonly mono aria-label="Listing URL" />
			<CopyButton text={listing.url} label="Copy listing URL" />
			<Button href={listing.vccUrl}>Open in VCC</Button>
		</div>
		<p class="small muted">
			Read more about package listings in the
			<a
				href="https://vcc.docs.vrchat.com/guides/community-repositories"
				target="_blank"
				rel="noreferrer">VCC documentation</a
			>.
		</p>
	{/if}
</Dialog>

<style>
	.row {
		display: flex;
		gap: var(--s-2);
	}

	.small {
		font-size: var(--font-xs);
	}

	@media (max-width: 640px) {
		.row {
			flex-wrap: wrap;
		}
	}
</style>
