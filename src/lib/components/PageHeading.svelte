<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<header class="heading">
	<h1>{title}</h1>
	{#if description}
		<p class="muted">{description}</p>
	{/if}
</header>

<style>
	.heading {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--s-2);
		padding-block: var(--s-10) var(--s-12);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: var(--font-3xl);
		font-weight: var(--weight-extra);
		line-height: 1;
	}

	p {
		font-size: var(--font-lg);
		max-width: 40rem;
	}

	@media (min-width: 640px) {
		.heading {
			padding-block: var(--s-16) var(--s-24);
		}

		h1 {
			font-size: var(--font-4xl);
		}
	}
</style>
