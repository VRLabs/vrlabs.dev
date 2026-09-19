<script lang="ts">
	import ShoppingBasket from '@lucide/svelte/icons/shopping-basket';
	import { cart } from '$lib/cart.svelte';
	import Button from './Button.svelte';

	const highlightMs = 600;

	let wrapper: HTMLElement | undefined = $state();
	let highlighted = $state(false);

	const label = $derived(`VCC list, ${cart.count} ${cart.count === 1 ? 'package' : 'packages'}`);

	$effect(() => {
		if (cart.additions === 0) return;

		highlighted = true;
		const timer = setTimeout(() => (highlighted = false), highlightMs);

		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
			wrapper?.animate(
				[
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.1)', offset: 0.35 },
					{ transform: 'scale(1)' }
				],
				{ duration: highlightMs, easing: 'ease-out' }
			);
		}

		return () => clearTimeout(timer);
	});
</script>

<span class="basket" bind:this={wrapper}>
	<Button
		variant={highlighted ? 'filled' : 'ghost'}
		color={highlighted ? 'primary' : 'secondary'}
		square
		style="--button-icon-size: 24px"
		aria-label={label}
		title="VCC list"
		onclick={() => (cart.open = true)}
		icon={ShoppingBasket}
	/>
	{#if cart.count > 0}
		<span class={['count', highlighted && 'highlighted']} aria-hidden="true">{cart.count}</span>
	{/if}
</span>

<style>
	.basket {
		position: relative;
		display: inline-flex;
	}

	.count {
		position: absolute;
		top: 0;
		right: 0;
		display: grid;
		place-items: center;
		min-width: 1.125rem;
		height: 1.125rem;
		padding-inline: var(--s-1);
		border-radius: var(--radius-full);
		background-color: var(--color-text-accent);
		color: var(--color-text-inverse);
		font-size: var(--font-3xs);
		font-weight: var(--weight-extra);
		line-height: 1;
		pointer-events: none;

		&.highlighted {
			background-color: transparent;
		}
	}
</style>
