import type { Component } from 'svelte';
import Discord from './icons/Discord.svelte';
import Github from './icons/Github.svelte';
import Patreon from './icons/Patreon.svelte';
import Twitter from './icons/Twitter.svelte';

export const site = {
	name: 'VRLabs',
	description: 'Bringing free to use tools, systems, and knowledge to VRChat creators',
	ogImage: '/images/og-image.png',
	sourceUrl: 'https://github.com/VRLabs/vrlabs.dev'
};

export const navLinks = [
	{ name: 'About', href: '/' },
	{ name: 'Packages', href: '/packages' }
] as const;

export interface Social {
	name: string;
	href: string;
	icon: Component<{ size?: number | string }>;
}

export const socials: Social[] = [
	{ name: 'GitHub', href: 'https://github.com/VRLabs', icon: Github },
	{ name: 'Discord', href: 'https://discord.vrlabs.dev/', icon: Discord },
	{ name: 'Twitter', href: 'https://twitter.com/vrlabsdev', icon: Twitter },
	{ name: 'Patreon', href: 'https://www.patreon.com/VRLabs/posts', icon: Patreon }
];

export const categoryOrder = ['essentials', 'systems', 'components', 'networking'];

export const avatarUrl = 'https://vrchat.com/home/avatar/avtr_e696906c-a086-4c88-a946-b27d3d410241';
export const schoolUrl = 'https://vrc.school';
