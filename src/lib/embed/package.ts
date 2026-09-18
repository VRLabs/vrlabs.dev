import { formatCount } from '$lib/format';
import type { Package, PackageStats, QuestCompatibility } from '$lib/types';
import {
	actionRow,
	container,
	embed,
	gallery,
	linkButton,
	rgbColor,
	section,
	separator,
	text,
	thumbnail,
	withinLimits,
	type ComponentEmbed,
	type ContainerChild
} from './components';

const accentColor = rgbColor('#A1CBFF');
const maxDescriptionLength = 200;

const questText: Record<QuestCompatibility, string> = {
	full: 'compatible',
	partial: 'partially compatible',
	none: 'not compatible'
};

export interface PackageEmbedUrls {
	page: string;
	addToVcc: string;
}

function truncate(value: string, length: number) {
	if (value.length <= length) return value;
	return value.slice(0, length - 1).trimEnd() + '…';
}

function details(pkg: Package, stats: PackageStats | null) {
	const lines = [`-# Version ${pkg.version}`];
	if (stats) lines.push(`-# Downloads: ${formatCount(stats.downloads)}`);
	if (pkg.quest !== 'unknown') lines.push(`-# Quest: ${questText[pkg.quest]}`);
	return text(lines.join('\n'));
}

function buttons(pkg: Package, urls: PackageEmbedUrls) {
	const row = [
		linkButton('Add to VCC', urls.addToVcc, '🖥️'),
		linkButton('Website', urls.page, '🌐')
	];
	const download = pkg.unityPackageUrl ?? pkg.zipUrl;
	if (download) row.push(linkButton('Download', download, '💾'));
	if (pkg.repoUrl) row.push(linkButton('GitHub', pkg.repoUrl));
	return actionRow(row);
}

function build(
	pkg: Package,
	stats: PackageStats | null,
	urls: PackageEmbedUrls,
	options: { gallery: boolean; descriptionLength: number }
): ComponentEmbed {
	const heading = text(`# ${pkg.name}\n${truncate(pkg.description, options.descriptionLength)}`);
	const info = [heading, details(pkg, stats)];

	const components: ContainerChild[] = [
		pkg.previewImage ? section(info, thumbnail(pkg.previewImage, pkg.name)) : text(heading.content),
		...(pkg.previewImage ? [] : [details(pkg, stats)])
	];

	const preview = pkg.previewGif ?? pkg.previewImage;
	if (options.gallery && preview) {
		components.push(separator({ spacing: 2 }), gallery([preview]));
	}

	components.push(separator({ spacing: 2 }), buttons(pkg, urls));

	return embed(container(components, { accentColor }));
}

export function buildPackageEmbed(
	pkg: Package,
	stats: PackageStats | null,
	urls: PackageEmbedUrls
): ComponentEmbed {
	const attempts = [
		{ gallery: true, descriptionLength: Infinity },
		{ gallery: false, descriptionLength: Infinity },
		{ gallery: false, descriptionLength: maxDescriptionLength }
	];

	for (const options of attempts) {
		const result = build(pkg, stats, urls, options);
		if (withinLimits(result)) return result;
	}

	return build(pkg, stats, urls, attempts[attempts.length - 1]);
}
