<script lang="ts">
	import { site } from '$lib/config';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="inner">
		<span>© {year} VRLabs LLC</span>
		<a href={site.sourceUrl} target="_blank" rel="external noreferrer">Source code</a>
	</div>
</footer>

<style>
	footer {
		margin-block-start: auto;
		border-top: var(--border-style);
		background-color: var(--color-bg-nav);
		font-size: var(--font-xs);
		color: var(--color-text-high);
		height: var(--layout-nav-height);
	}

	.inner {
		max-width: var(--layout-max-width);
		margin-inline: auto;
		padding: var(--s-4) var(--layout-page-padding);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
		height: 100%;
	}

	a {
		color: inherit;

		&:hover {
			color: var(--color-text-accent);
		}
	}

	@media (min-width: 640px) {
		.inner {
			padding-inline: var(--s-10);
		}
	}
</style>
