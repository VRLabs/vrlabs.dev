<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Button from './Button.svelte';

	interface Props {
		/** Text to copy, or a function that produces it when clicked */
		text: string | (() => Promise<string>);
		label?: string;
		variant?: 'primary' | 'secondary' | 'outlined' | 'minimal';
		size?: 'large' | 'medium' | 'small';
		round?: boolean;
		disabled?: boolean;
	}

	let {
		text,
		label = 'Copy to clipboard',
		variant = 'secondary',
		size = 'medium',
		round = false,
		disabled = false
	}: Props = $props();

	const copiedDurationMs = 2000;

	let copied = $state(false);
	let busy = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function write(produce: () => Promise<string>) {
		if (typeof ClipboardItem === 'undefined') {
			await navigator.clipboard.writeText(await produce());
			return;
		}

		const blob = produce().then((value) => new Blob([value], { type: 'text/plain' }));
		await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
	}

	async function copy() {
		if (busy) return;
		busy = true;

		try {
			if (typeof text === 'string') await navigator.clipboard.writeText(text);
			else await write(text);

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
	{disabled}
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
