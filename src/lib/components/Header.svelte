<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { navLinks, socials } from '$lib/config';
	import Logo from '$lib/icons/Logo.svelte';
	import Button from './Button.svelte';

	let menu: HTMLElement | undefined = $state();

	function isCurrent(href: string) {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	}

	afterNavigate(() => {
		if (menu?.matches(':popover-open')) menu.hidePopover();
	});
</script>

{#snippet logo()}
	<Button
		href={resolve('/')}
		variant="minimal"
		square
		class="logo"
		style="--button-icon-size: 40px"
		aria-label="VRLabs home"
	>
		<Logo />
	</Button>
{/snippet}

{#snippet navList()}
	<ul class="nav-list">
		{#each navLinks as link (link.href)}
			<li>
				<Button
					href={resolve(link.href)}
					variant="minimal"
					class="nav-link"
					aria-current={isCurrent(link.href) ? 'page' : undefined}
				>
					{link.name}
				</Button>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet socialList(names: string[])}
	<ul class="social-list">
		{#each socials.filter((social) => names.includes(social.name)) as social (social.name)}
			<li>
				<Button
					href={social.href}
					variant="minimal"
					square
					class="social-link"
					style="--button-icon-size: 24px"
					aria-label={social.name}
					title={social.name}
				>
					<social.icon />
				</Button>
			</li>
		{/each}
	</ul>
{/snippet}

<header class="header">
	<div class="inner">
		<div class="start">
			<div class="desktop-only">{@render logo()}</div>
			<div class="mobile-only">
				<Button
					variant="minimal"
					square
					style="--button-icon-size: 28px"
					popovertarget="mobile-menu"
					aria-label="Open menu"
				>
					<Menu aria-hidden="true" />
				</Button>
			</div>
		</div>
		<nav class="center" aria-label="Main">
			<div class="desktop-only">{@render navList()}</div>
			<div class="mobile-only">{@render logo()}</div>
		</nav>
		<div class="end">
			<div class="desktop-wide-only">{@render socialList(socials.map((s) => s.name))}</div>
			<div class="mobile-wide-only">{@render socialList(['GitHub'])}</div>
		</div>
	</div>
</header>

<div id="mobile-menu" class="mobile-menu" popover="auto" bind:this={menu}>
	<div class="mobile-menu-top">
		<Button
			variant="minimal"
			square
			style="--button-icon-size: 28px"
			popovertarget="mobile-menu"
			popovertargetaction="hide"
			aria-label="Close menu"
		>
			<X aria-hidden="true" />
		</Button>
	</div>
	<nav aria-label="Main">{@render navList()}</nav>
	<div class="mobile-menu-socials">{@render socialList(socials.map((s) => s.name))}</div>
</div>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 10;
		height: var(--layout-nav-height);
		border-bottom: var(--border-style);
		background-color: var(--color-bg-nav);
	}

	.inner {
		max-width: var(--layout-max-width);
		height: 100%;
		margin-inline: auto;
		padding-inline: var(--layout-page-padding);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
	}

	.start,
	.center,
	.end {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.center {
		justify-content: center;
	}

	.end {
		justify-content: flex-end;
	}

	.nav-list,
	.social-list {
		list-style: none;
		padding: 0;
		display: flex;
		align-items: center;
	}

	.nav-list {
		gap: var(--s-6);
	}

	.social-list {
		gap: var(--s-1);
	}

	.header :global(.logo) {
		color: var(--color-text);
	}

	.header :global(.nav-link),
	.mobile-menu :global(.nav-link) {
		color: var(--color-text);
		font-weight: var(--weight-extra);
	}

	.header :global(.nav-link[aria-current='page']),
	.mobile-menu :global(.nav-link[aria-current='page']) {
		color: var(--color-text-accent);
	}

	.desktop-only,
	.desktop-wide-only {
		display: none;
	}

	@media (min-width: 768px) {
		.desktop-only {
			display: block;
		}

		.mobile-only {
			display: none;
		}
	}

	@media (min-width: 1024px) {
		.desktop-wide-only {
			display: block;
		}

		.mobile-wide-only {
			display: none;
		}
	}

	@media (min-width: 640px) {
		.inner {
			padding-inline: var(--s-10);
		}
	}

	.mobile-menu {
		position: fixed;
		inset: 0 auto 0 0;
		height: 100%;
		width: min(var(--layout-menu-width), 85vw);
		display: none;
		flex-direction: column;
		gap: var(--s-4);
		padding: var(--s-3) var(--s-4);
		background-color: var(--color-bg);
		border-inline-end: var(--border-style);
		overflow-y: auto;

		&:popover-open {
			display: flex;
		}

		&::backdrop {
			background-color: rgb(0 0 0 / 0.4);
			animation: fade-in var(--duration) ease-out;
		}

		& .nav-list {
			flex-direction: column;
			align-items: stretch;
			gap: var(--s-2);
			padding-block: var(--s-4);
			border-block: var(--border-style);
		}

		& :global(.nav-link) {
			width: 100%;
			justify-content: flex-start;
		}
	}

	.mobile-menu-top {
		display: flex;
		align-items: center;
		height: var(--field-size);
	}

	.mobile-menu-socials .social-list {
		justify-content: space-between;
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
