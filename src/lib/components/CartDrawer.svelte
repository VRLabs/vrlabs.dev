<script lang="ts">
	import { cart } from '$lib/cart.svelte';
	import { createListing } from '$lib/packages.remote';
	import { vcc } from '$lib/vcc.svelte';
	import Button from './Button.svelte';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import CopyButton from './CopyButton.svelte';

	let panel: HTMLElement | undefined = $state();

	$effect(() => {
		if (!panel) return;
		const isOpen = panel.matches(':popover-open');
		if (cart.open && !isOpen) panel.showPopover();
		else if (!cart.open && isOpen) panel.hidePopover();
	});

	function ontoggle(event: ToggleEvent) {
		cart.open = event.newState === 'open';
	}

	async function copyLink() {
		const listing = await createListing(cart.ids);
		return listing.vccUrl;
	}
</script>

{#snippet toggle(action: 'show' | 'hide')}
	<button
		type="button"
		class="toggle"
		popovertarget="cart-panel"
		popovertargetaction={action}
		aria-expanded={action === 'hide'}
	>
		VCC List
		<span class="count" aria-label="{cart.count} packages">{cart.count}</span>
	</button>
{/snippet}

<div class="bar">
	<div class="bar-inner">{@render toggle('show')}</div>
</div>

<div
	id="cart-panel"
	class="panel"
	popover="auto"
	role="dialog"
	aria-label="VCC list"
	bind:this={panel}
	{ontoggle}
>
	<div class="panel-inner">
		{@render toggle('hide')}
		<div class="items scrollbar">
			{#if cart.count === 0}
				<p class="muted empty">You have no packages selected</p>
			{:else}
				<ul>
					{#each cart.items as item (item.id)}
						<li>
							<span class="item-name">{item.name}</span>
							<Button
								variant="destructive"
								square
								onclick={() => cart.remove(item.id)}
								aria-label="Remove {item.name} from the list"
							>
								<Trash2 aria-hidden="true" />
							</Button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<div class="actions">
			<Button
				expand
				disabled={cart.count === 0 || vcc.loading}
				onclick={() => vcc.launch(() => createListing(cart.ids))}
			>
				Add to VCC
			</Button>
			<CopyButton text={copyLink} label="Copy VCC link" disabled={cart.count === 0} />
			<Button
				variant="minimal"
				disabled={cart.count === 0}
				onclick={() => cart.clear()}
				aria-label="Clear the list"
				title="Clear the list"
			>
				Clear
			</Button>
		</div>
	</div>
</div>

<style>
	.bar,
	.panel {
		position: fixed;
		inset: auto 0 0 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.bar {
		z-index: 9;
	}

	.bar-inner,
	.panel-inner {
		width: min(42rem, 100%);
		pointer-events: auto;
		border: var(--border-style);
		border-bottom: none;
		border-radius: var(--radius-box) var(--radius-box) 0 0;
		background-color: var(--color-bg-nav);
	}

	.panel {
		display: none;
		width: 100%;
		max-height: min(80dvh, 32rem);

		&:popover-open {
			display: flex;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.4);
			animation: fade-in var(--duration) ease-out;
		}
	}

	.panel-inner {
		display: flex;
		flex-direction: column;
		max-height: inherit;
	}

	.toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-3);
		width: 100%;
		padding: var(--s-4);
		border: none;
		border-radius: var(--radius-box) var(--radius-box) 0 0;
		background: none;
		color: var(--color-text);
		font-family: var(--font-heading);
		font-size: var(--font-xl);
		font-weight: var(--weight-extra);
		line-height: 1;
		cursor: pointer;
		transition: color var(--duration);

		&:hover {
			color: var(--color-text-accent);
		}

		&:focus-visible {
			outline-offset: -3px;
		}
	}

	.count {
		display: inline-grid;
		place-items: center;
		min-width: var(--selector-size-lg);
		height: var(--selector-size-lg);
		padding-inline: var(--s-2);
		border-radius: var(--radius-full);
		background-color: var(--color-text-accent);
		color: var(--color-text-inverse);
		font-family: var(--font-sans);
		font-size: var(--font-sm);
	}

	.items {
		margin: 0 var(--s-4) var(--s-2);
		padding: var(--s-4);
		border: var(--border-style);
		border-radius: var(--radius-field);
		background-color: var(--color-bg);
		overflow-y: auto;
		min-height: 5rem;
	}

	.empty {
		text-align: center;
		font-size: var(--font-xs);
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	li {
		display: flex;
		align-items: center;
		gap: var(--s-2);
	}

	.item-name {
		flex: 1;
		display: flex;
		align-items: center;
		height: var(--field-size);
		padding-inline: var(--s-4);
		border-radius: var(--radius-field);
		background-color: var(--color-bg-high);
		font-size: var(--font-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-4) var(--s-4);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
