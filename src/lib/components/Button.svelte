<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface BaseProps {
		variant?: 'primary' | 'secondary' | 'outlined' | 'minimal' | 'destructive';
		size?: 'large' | 'medium' | 'small';
		square?: boolean;
		round?: boolean;
		expand?: boolean;
	}

	type ButtonProps = HTMLButtonAttributes & BaseProps & { href?: never; target?: never };

	type LinkProps = HTMLAnchorAttributes &
		BaseProps & { href: string; type?: never; disabled?: never };

	type Props = ButtonProps | LinkProps;

	let {
		variant = 'primary',
		size = 'medium',
		square = false,
		round = false,
		expand = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const external = $derived(!!rest.href && /^https?:\/\//.test(rest.href));
</script>

<svelte:element
	this={rest.href ? 'a' : 'button'}
	type={rest.href ? undefined : 'button'}
	rel={external ? 'external noreferrer' : undefined}
	target={external ? '_blank' : undefined}
	class={[
		'button',
		variant,
		size,
		square && 'square',
		round && 'round',
		expand && 'expand',
		className
	]}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-1-5);
		border: var(--border-style-accent);
		border-radius: var(--radius-field);
		appearance: none;
		background-color: var(--color-text-accent);
		color: var(--color-text-inverse);
		cursor: pointer;
		font-size: var(--font-sm);
		font-weight: var(--weight-extra);
		padding: 0 var(--s-4);
		user-select: none;
		outline-color: var(--color-text-accent);
		height: var(--field-size);
		white-space: nowrap;
		text-decoration: none;
		transition:
			background-color var(--duration),
			border-color var(--duration),
			color var(--duration);

		&:hover {
			text-decoration: none;
			background-color: color-mix(in oklch, var(--color-text-accent) 88%, var(--color-text));
			border-color: color-mix(in oklch, var(--color-text-accent) 88%, var(--color-text));
		}

		&:focus-visible {
			outline-style: solid;
			outline-width: 2px;
			outline-offset: 1px;
		}

		&:active {
			transform: translateY(1px);
		}

		& :global(svg) {
			width: var(--button-icon-size, var(--field-size-icon));
			height: var(--button-icon-size, var(--field-size-icon));
			flex-shrink: 0;
		}

		&:disabled,
		&[aria-disabled='true'] {
			cursor: not-allowed;
			opacity: 0.5;
			transform: none;
		}
	}

	.secondary {
		border-color: var(--color-bg-higher);
		background-color: var(--color-bg-higher);
		color: var(--color-text);
		outline-color: var(--color-text-accent);

		&:hover {
			background-color: var(--color-border-high);
			border-color: var(--color-border-high);
		}
	}

	.outlined {
		background-color: transparent;
		color: var(--color-text-accent);

		&:hover {
			background-color: color-mix(in oklch, var(--color-text-accent) 12%, transparent);
			border-color: var(--color-text-accent);
		}
	}

	.minimal {
		border-color: transparent;
		background-color: transparent;
		color: var(--color-text-high);

		&:hover {
			background-color: color-mix(in oklch, var(--color-text) 10%, transparent);
			border-color: transparent;
			color: var(--color-text);
		}
	}

	.destructive {
		border-color: var(--color-error);
		background-color: var(--color-error);
		color: var(--color-base-7);
		outline-color: var(--color-error);

		&:hover {
			background-color: color-mix(in oklch, var(--color-error) 85%, var(--color-text));
			border-color: color-mix(in oklch, var(--color-error) 85%, var(--color-text));
		}
	}

	@media (prefers-color-scheme: dark) {
		.destructive {
			color: var(--color-base-0);
		}
	}

	.small {
		font-size: var(--font-xs);
		height: var(--field-size-sm);
		padding: 0 var(--s-3);
		gap: var(--s-1);
	}

	.large {
		font-size: var(--font-md);
		height: var(--field-size-lg);
		padding: 0 var(--s-6);
		gap: var(--s-2);
	}

	.square {
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
		padding: 0;
	}

	.round {
		border-radius: var(--radius-full);
	}

	.expand {
		width: 100%;
	}
</style>
