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
		<button type="button">
			<selectedcontent></selectedcontent>
			<span class="sizer" aria-hidden="true">
				{#each options as option (option.value)}
					<span>{option.label}</span>
				{/each}
			</span>
		</button>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<ChevronsUpDown size={18} class="icon" aria-hidden="true" />
</div>

<style>
	.select {
		position: relative;
		display: inline-flex;
	}

	select {
		appearance: none;
		height: var(--field-size);
		padding: 0 calc(var(--field-padding) + var(--field-size-icon) + var(--s-1-5)) 0
			var(--field-padding);
		border: var(--border-style);
		border-radius: var(--radius-field);
		background-color: var(--color-bg);
		color: var(--color-text);
		font-size: var(--font-sm);
		cursor: pointer;
		text-align: start;

		&:focus-visible {
			outline: var(--focus-ring);
			outline-offset: 1px;
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

		select > button {
			display: grid;
			padding: 0;
			border: none;
			background: none;
			color: inherit;
			font: inherit;
			cursor: inherit;
		}

		selectedcontent,
		.sizer {
			grid-area: 1 / 1;
			white-space: nowrap;
		}

		.sizer {
			display: grid;
			visibility: hidden;

			& > span {
				grid-area: 1 / 1;
			}
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
