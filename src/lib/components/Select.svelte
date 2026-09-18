<script lang="ts">
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value: string;
		options: Option[];
		'aria-label': string;
	}

	let { value = $bindable(), options, 'aria-label': ariaLabel }: Props = $props();
</script>

<div class="select">
	<select bind:value aria-label={ariaLabel}>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<span class="sizer" aria-hidden="true">
		{#each options as option (option.value)}
			<span>{option.label}</span>
		{/each}
	</span>
	<ChevronsUpDown size={18} class="icon" aria-hidden="true" />
</div>

<style>
	.select {
		--padding-start: var(--field-padding);
		--padding-end: calc(var(--field-padding) + var(--field-size-icon) + var(--s-1-5));

		position: relative;
		display: inline-grid;
		font-size: var(--font-sm);
	}

	select,
	.sizer {
		grid-area: 1 / 1;
		padding: 0 var(--padding-end) 0 var(--padding-start);
		border: var(--border-style);
		white-space: nowrap;
	}

	select {
		appearance: none;
		width: 100%;
		height: var(--field-size);
		border-radius: var(--radius-field);
		background-color: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		text-align: start;

		&:focus-visible {
			outline: var(--focus-ring);
			outline-offset: 1px;
		}
	}

	.sizer {
		display: grid;
		visibility: hidden;
		border-color: transparent;

		& > span {
			grid-area: 1 / 1;
		}
	}

	.select :global(.icon) {
		position: absolute;
		top: 50%;
		right: var(--field-padding);
		transform: translateY(-50%);
		color: var(--color-text-high);
		pointer-events: none;
	}

	@supports (appearance: base-select) {
		select,
		select::picker(select) {
			appearance: base-select;
		}

		select {
			display: flex;
			align-items: center;

			&:open {
				outline: var(--focus-ring);
				outline-offset: 1px;
			}
		}

		select::picker-icon {
			display: none;
		}

		select::picker(select) {
			min-width: anchor-size(width);
			width: max-content;
			margin: var(--s-2) 0;
			padding: var(--s-1);
			border: var(--border-style);
			border-radius: var(--radius-box);
			background-color: var(--color-bg);
			color: var(--color-text);
			outline: none;
		}

		option {
			display: flex;
			align-items: center;
			padding: var(--s-1-5);
			border-radius: var(--radius-field);
			font-size: var(--font-sm);
			font-weight: var(--weight-semi);
			white-space: nowrap;
			cursor: pointer;
			outline: none;

			&:hover,
			&:focus-visible {
				background-color: var(--color-bg-high);
			}

			&:checked {
				color: var(--color-text-accent);
				font-weight: var(--weight-bold);
			}

			&::checkmark {
				display: none;
			}
		}
	}
</style>
