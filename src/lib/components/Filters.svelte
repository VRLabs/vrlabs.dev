<script lang="ts">
	import type { QuestFilter } from '$lib/filters';
	import type { SortKey } from '$lib/sort';
	import type { Category } from '$lib/types';
	import Input from './Input.svelte';
	import Select from './Select.svelte';
	import SortControls from './SortControls.svelte';

	interface Props {
		categories: Category[];
		query: string;
		category: string;
		quest: QuestFilter;
		sort: SortKey;
		count: number;
	}

	let {
		categories,
		query = $bindable(''),
		category = $bindable('all'),
		quest = $bindable('any'),
		sort = $bindable('default'),
		count
	}: Props = $props();

	const categoryOptions = $derived([
		{ value: 'all', label: 'All categories' },
		...categories.map((entry) => ({ value: entry.id, label: entry.name }))
	]);

	const questOptions: { value: QuestFilter; label: string }[] = [
		{ value: 'any', label: 'Any platform' },
		{ value: 'compatible', label: 'Quest compatible' },
		{ value: 'full', label: 'Fully Quest compatible' }
	];
</script>

<div class="filters">
	<div class="row">
		<div class="search">
			<Input
				type="search"
				bind:value={query}
				placeholder="Search packages…"
				aria-label="Search packages"
			/>
		</div>
		<Select bind:value={category} options={categoryOptions} aria-label="Category" />
		<Select bind:value={quest} options={questOptions} aria-label="Quest compatibility" />
	</div>
	<div class="row">
		<SortControls bind:value={sort} />
		<p class="count muted" aria-live="polite">
			{count}
			{count === 1 ? 'package' : 'packages'}
		</p>
	</div>
</div>

<style>
	.filters {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		padding: var(--s-4);
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-2);
	}

	.search {
		flex: 1 1 16rem;
	}

	.count {
		margin-inline-start: auto;
		font-size: var(--font-xs);
		white-space: nowrap;
	}
</style>
