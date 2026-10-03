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
		border-top: var(--border-style);
		background-color: var(--color-bg-nav);
		font-size: var(--font-xs);
		color: var(--color-text-high);
		height: var(--layout-nav-height);
	}

	.inner {
		max-width: var(--layout-max-width);
		height: 100%;
		margin-inline: auto;
		padding-inline: var(--layout-main-padding);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--s-2) var(--s-4);

		@media (min-width: 640px) {
			justify-content: space-between;
		}
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
</style>
