<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Button from './Button.svelte';

	interface Props {
		text: string | (() => Promise<string>);
		label?: string;
		variant?: 'primary' | 'secondary' | 'outlined' | 'minimal';
		size?: 'large' | 'medium' | 'small';
		round?: boolean;
	}

	let {
		text,
		label = 'Copy to clipboard',
		variant = 'secondary',
		size = 'medium',
		round = false
	}: Props = $props();

	const copiedDurationMs = 2000;

	let copied = $state(false);
	let busy = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		if (busy) return;
		busy = true;

		try {
			const value = typeof text === 'string' ? text : await text();
			if (!value) return;

			await navigator.clipboard.writeText(value);
			copied = true;

			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), copiedDurationMs);
		} catch (error) {
			console.error('Could not copy', error);
		} finally {
			busy = false;
		}
	}
</script>

<Button
	{variant}
	{size}
	{round}
	square
	onclick={copy}
	title={label}
	aria-label={copied ? 'Copied' : label}
	aria-live="polite"
>
	{#if copied}
		<Check aria-hidden="true" />
	{:else}
		<Copy aria-hidden="true" />
	{/if}
</Button>
