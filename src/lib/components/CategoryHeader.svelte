<script lang="ts">
	import type { Category } from '$lib/types';
	import Button from './Button.svelte';
	import CopyButton from './CopyButton.svelte';

	interface Props {
		category: Category;
	}

	let { category }: Props = $props();
</script>

<header class="category-header">
	<h2 id="category-{category.id}">{category.name}</h2>
	<div class="actions">
		<Button href={category.vccUrl} variant="secondary">Add category to VCC</Button>
		<CopyButton text={category.listingUrl} label="Copy listing URL" />
	</div>
</header>

<style>
	.category-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-4);
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	h2 {
		font-family: var(--font-heading);
		font-size: var(--font-xl);
		font-weight: var(--weight-extra);
		line-height: 1.6;
	}

	.actions {
		display: flex;
		gap: var(--s-2);
	}

	@media (min-width: 640px) {
		.category-header {
			flex-direction: row;
		}

		h2 {
			font-size: var(--font-2xl);
		}
	}
</style>
