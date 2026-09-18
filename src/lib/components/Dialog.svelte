<script lang="ts">
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import Button from './Button.svelte';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		size?: 'medium' | 'large';
		children: Snippet;
		actions?: Snippet;
	}

	let { open, title, onclose, size = 'medium', children, actions }: Props = $props();

	const titleId = $props.id();

	function sync(dialog: HTMLDialogElement) {
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	}

	function closeOnBackdropClick(event: MouseEvent & { currentTarget: HTMLDialogElement }) {
		if (event.target !== event.currentTarget) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const outside =
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom;
		if (outside) event.currentTarget.close();
	}
</script>

<dialog
	{@attach sync}
	{onclose}
	onclick={closeOnBackdropClick}
	closedby="any"
	class={[size]}
	aria-labelledby={titleId}
>
	<article class="scrollbar">
		<header>
			<h2 id={titleId}>{title}</h2>
			<div class="actions">
				{@render actions?.()}
				<Button
					variant="ghost"
					color="secondary"
					size="small"
					square
					round
					onclick={onclose}
					aria-label="Close"
					icon={X}
				/>
			</div>
		</header>
		<div class="content">{@render children()}</div>
	</article>
</dialog>

<style>
	dialog {
		margin: auto;
		width: min(40rem, calc(100dvw - 2rem - env(safe-area-inset-left) - env(safe-area-inset-right)));
		max-height: calc(100dvh - 2rem - env(safe-area-inset-top) - env(safe-area-inset-bottom));
		padding: 0;
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg);
		color: var(--color-text);
		overscroll-behavior: contain;
		overflow: hidden;

		&[open] {
			display: flex;
			animation: zoom-in var(--duration) ease-out;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.5);
			animation: fade-in var(--duration) ease-out;
		}

		&.large {
			width: min(
				52rem,
				calc(100dvw - 2rem - env(safe-area-inset-left) - env(safe-area-inset-right))
			);
		}
	}

	article {
		overflow-y: auto;
		width: 100%;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
		padding: var(--s-3) var(--s-3) var(--s-3) var(--s-6);
		border-bottom: var(--border-style);
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: var(--color-bg);
	}

	h2 {
		font-size: var(--font-lg);
		font-weight: var(--weight-extra);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--s-1);
		flex-shrink: 0;
	}

	.content {
		padding: var(--s-6);
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes zoom-in {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 640px) {
		header {
			padding-inline-start: var(--s-4);
		}

		.content {
			padding: var(--s-4);
		}
	}
</style>
