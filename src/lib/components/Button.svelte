<script module lang="ts">
	import type { Component } from 'svelte';

	export type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'minimal';
	export type ButtonColor = 'primary' | 'secondary' | 'destructive' | 'success';
	export type ButtonSize = 'large' | 'medium' | 'small';
	export type ButtonIcon = Component<{ 'aria-hidden'?: boolean | 'true' | 'false' }>;
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	interface BaseProps {
		variant?: ButtonVariant;
		color?: ButtonColor;
		size?: ButtonSize;
		icon?: ButtonIcon;
		square?: boolean;
		round?: boolean;
		expand?: boolean;
	}

	type ButtonProps = HTMLButtonAttributes & BaseProps & { href?: never; target?: never };

	type LinkProps = HTMLAnchorAttributes &
		BaseProps & { href: string; type?: never; disabled?: never };

	type Props = ButtonProps | LinkProps;

	let {
		variant = 'filled',
		color = 'primary',
		size = 'medium',
		icon: Icon,
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
		color,
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
	{#if Icon}
		<Icon aria-hidden="true" />
	{/if}
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

		&:focus-visible {
			outline-style: solid;
			outline-width: 2px;
			outline-offset: 1px;
			outline-color: var(--outline-color, var(--background-color));
		}

		&:active {
			transform: scale(0.95, 0.97);
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

	.primary {
		--background-color: var(--color-text-accent);
		--text-color: var(--color-text-inverse);
	}

	.secondary {
		--background-color: var(--color-bg-higher);
		--text-color: var(--color-text);
		--outline-color: var(--color-text-accent);

		&.outlined,
		&.ghost,
		&.minimal {
			--background-color: var(--color-text);
		}
	}

	.destructive {
		--background-color: var(--color-error);
		--text-color: var(--color-text-inverse);
	}

	.success {
		--background-color: var(--color-success);
		--text-color: var(--color-text-inverse);
	}

	.filled {
		background-color: var(--background-color);
		color: var(--text-color);
		border-color: var(--background-color);
	}

	.outlined {
		background-color: transparent;
		color: var(--background-color);
		border-color: var(--background-color);
	}

	.ghost {
		background-color: transparent;
		color: var(--background-color);
		border-color: transparent;
	}

	.minimal {
		background-color: transparent;
		color: var(--background-color);
		border-color: transparent;
	}

	.filled {
		&:hover:not(:active) {
			background-color: color-mix(in oklch, var(--background-color) 95%, black);
			border-color: color-mix(in oklch, var(--background-color) 95%, black);
		}
	}

	.outlined,
	.ghost {
		&:hover:not(:active),
		&:focus-visible {
			background-color: color-mix(in oklch, var(--background-color) 15%, transparent);
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
