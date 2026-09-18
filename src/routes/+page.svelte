<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Button from '$lib/components/Button.svelte';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { avatarUrl, schoolUrl, site, socials } from '$lib/config';

	const features = [
		{
			title: 'Packages',
			text: 'Easily view and download our packages or add them to your VRChat Creator Companion by visiting our package listing page!',
			image: '/images/idle.webp',
			href: '/packages',
			action: 'View listing',
			icon: ArrowRight
		},
		{
			title: 'Avatar',
			text: 'Test all of our packages in VRChat by trying out our free to use avatar!',
			image: '/images/avatar.webp',
			href: avatarUrl,
			action: 'Get avatar',
			icon: ExternalLink
		},
		{
			title: 'Learn',
			text: 'Learn everything you need to know to make VRChat avatar systems.',
			image: '/images/unity.webp',
			href: schoolUrl,
			action: 'Get started',
			icon: ExternalLink,
			padded: true
		}
	];
</script>

<Seo title={site.name} description={site.description} url={site.origin} />

<PageHeading title={site.name} description={site.description} />

<div class="features">
	{#each features as feature (feature.title)}
		<section class="feature" aria-labelledby="feature-{feature.title}">
			<img
				class={['mascot', feature.padded && 'padded']}
				src={feature.image}
				alt=""
				width="192"
				height="192"
				loading={feature.title === 'Packages' ? 'eager' : 'lazy'}
			/>
			<div class="feature-text">
				<h2 id="feature-{feature.title}">{feature.title}</h2>
				<p class="muted">{feature.text}</p>
				<Button href={feature.href} size="large" round class="feature-button">
					{feature.action}
					<feature.icon aria-hidden="true" />
				</Button>
			</div>
		</section>
	{/each}
</div>

<ul class="socials" aria-label="Social media">
	{#each socials as social (social.name)}
		<li>
			<a
				href={social.href}
				target="_blank"
				rel="external noreferrer"
				class={social.name.toLowerCase()}
			>
				<social.icon size={48} />
				{social.name}
			</a>
		</li>
	{/each}
</ul>

<style>
	.features {
		display: flex;
		flex-direction: column;
		gap: var(--s-10);
		margin-block: var(--s-4) var(--s-10);
	}

	.feature {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		padding: var(--s-16) var(--s-4);
		border: var(--border-style);
		border-radius: var(--radius-box);
		background-color: var(--color-bg-high);
		text-align: center;

		&:first-child {
			border-top-color: var(--color-border-high);
		}
	}

	.mascot {
		width: 9rem;
		height: 9rem;
		object-fit: cover;
		transform: scaleX(-1);

		&.padded {
			padding: var(--s-4);
		}
	}

	.feature-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-1);
	}

	h2 {
		font-size: var(--font-xl);
		font-weight: var(--weight-extra);
	}

	.feature-text p {
		margin-block-end: var(--s-5);
	}

	.feature-text :global(.feature-button) {
		width: 100%;
		min-width: 11rem;
	}

	.socials {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--s-4);
		margin-block: var(--s-4) var(--s-16);

		& a {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--s-4);
			padding: var(--s-4);
			border: var(--border-style);
			border-radius: var(--radius-field);
			background-color: var(--color-bg-high);
			color: var(--color-text);
			font-weight: var(--weight-extra);
			transition: background-color var(--duration);

			&:hover {
				background-color: var(--color-bg-higher);
				text-decoration: none;
			}
		}

		& .discord :global(svg),
		& .twitter :global(svg) {
			color: var(--color-text-accent);
		}

		& .patreon :global(svg) {
			color: var(--color-error);
		}

		& .github :global(svg) {
			color: var(--color-text-high);
		}
	}

	@media (min-width: 500px) {
		.socials {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 640px) {
		.features {
			gap: var(--s-16);
			margin-block-end: var(--s-16);
		}

		.feature {
			flex-direction: row;
			text-align: left;
		}

		.mascot {
			width: 12rem;
			height: 12rem;
		}

		.feature-text {
			align-items: flex-start;
		}

		.feature-text :global(.feature-button) {
			width: auto;
		}

		h2 {
			font-size: var(--font-2xl);
		}
	}
</style>
