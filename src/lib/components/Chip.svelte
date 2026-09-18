<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		active?: boolean;
	}

	let { active = false, children, ...rest }: Props = $props();
</script>

<button type="button" class={['chip', active && 'active']} aria-pressed={active} {...rest}>
	{@render children?.()}
</button>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: var(--s-1);
		height: var(--selector-size);
		padding: 0 var(--s-3);
		border: var(--border-style-high);
		border-radius: var(--radius-full);
		background-color: transparent;
		color: var(--color-text-high);
		font-size: var(--font-2xs);
		font-weight: var(--weight-extra);
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		user-select: none;
		transition:
			background-color var(--duration),
			color var(--duration),
			border-color var(--duration);

		&:hover {
			color: var(--color-text);
			border-color: var(--color-text);
		}

		&.active {
			background-color: var(--color-bg-higher);
			border-color: var(--color-bg-higher);
			color: var(--color-text);
		}

		&:focus-visible {
			outline: var(--focus-ring);
			outline-offset: 1px;
		}

		& :global(svg) {
			width: var(--selector-size-sm);
			height: var(--selector-size-sm);
		}
	}
</style>
