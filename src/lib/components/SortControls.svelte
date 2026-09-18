<script lang="ts">
	import ArrowDownUp from '@lucide/svelte/icons/arrow-down-up';
	import type { SortKey } from '$lib/sort';
	import Button from './Button.svelte';

	interface Props {
		value: SortKey;
	}

	let { value = $bindable('default') }: Props = $props();

	const options: { key: Exclude<SortKey, 'default'>; label: string; description: string }[] = [
		{ key: 'name', label: 'Name', description: 'Sort packages by name' },
		{ key: 'downloads', label: 'Downloads', description: 'Sort packages by download count' },
		{ key: 'updated', label: 'Last updated', description: 'Sort packages by last release' },
		{ key: 'quest', label: 'Quest', description: 'Show Quest compatible packages first' }
	];

	/** Pressing the active option again returns to the default order */
	function toggle(key: SortKey) {
		value = value === key ? 'default' : key;
	}
</script>

<div class="sort" role="group" aria-label="Sort packages">
	<ArrowDownUp size={18} aria-hidden="true" />
	{#each options as option (option.key)}
		<Button
			color={value === option.key ? 'primary' : 'secondary'}
			size="small"
			aria-pressed={value === option.key}
			title={option.description}
			onclick={() => toggle(option.key)}
		>
			{option.label}
		</Button>
	{/each}
</div>

<style>
	.sort {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2);
		color: var(--color-text-high);
	}
</style>
