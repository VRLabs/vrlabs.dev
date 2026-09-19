<script lang="ts">
	import { site, socials } from '$lib/config';
	import Button from './Button.svelte';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="inner">
		<div class="legal">
			<span>© {year} VRLabs LLC</span>
			<a href={site.sourceUrl} target="_blank" rel="external noreferrer">Source code</a>
		</div>
		<ul class="socials" aria-label="Social media">
			{#each socials as social (social.name)}
				<li>
					<Button
						href={social.href}
						variant="ghost"
						color="secondary"
						square
						style="--button-icon-size: 24px"
						aria-label={social.name}
						title={social.name}
						icon={social.icon}
					/>
				</li>
			{/each}
		</ul>
	</div>
</footer>

<style>
	footer {
		margin-block-start: auto;
		border-top: var(--border-style);
		background-color: var(--color-bg-nav);
		font-size: var(--font-xs);
		color: var(--color-text-high);
		min-height: var(--layout-nav-height);
	}

	.inner {
		max-width: var(--layout-max-width);
		min-height: inherit;
		margin-inline: auto;
		padding: var(--s-3) var(--layout-page-padding);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2) var(--s-4);
	}

	.legal {
		display: flex;
		align-items: center;
		gap: var(--s-4);
	}

	a {
		color: inherit;

		&:hover {
			color: var(--color-text-accent);
		}
	}

	.socials {
		list-style: none;
		padding: 0;
		display: flex;
		align-items: center;
		gap: var(--s-1);
	}

	@media (min-width: 640px) {
		.inner {
			padding-inline: var(--s-10);
		}
	}
</style>
