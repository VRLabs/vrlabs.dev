export const ComponentType = {
	ActionRow: 1,
	Button: 2,
	Section: 9,
	TextDisplay: 10,
	Thumbnail: 11,
	MediaGallery: 12,
	Separator: 14,
	Container: 17
} as const;

export const SeparatorSpacing = { Small: 1, Large: 2 } as const;

const linkButtonStyle = 5;
const maxComponents = 40;
const maxPayloadBytes = 3000;
const maxMediaUrlLength = 2048;

export interface UnfurledMediaItem {
	url: string;
}

export interface LinkButton {
	type: typeof ComponentType.Button;
	style: typeof linkButtonStyle;
	url: string;
	label?: string;
	emoji?: { name: string };
	disabled?: boolean;
}

export interface ActionRow {
	type: typeof ComponentType.ActionRow;
	components: LinkButton[];
}

export interface TextDisplay {
	type: typeof ComponentType.TextDisplay;
	content: string;
}

export interface Thumbnail {
	type: typeof ComponentType.Thumbnail;
	media: UnfurledMediaItem;
	description?: string;
	spoiler?: boolean;
}

export interface MediaGalleryItem {
	media: UnfurledMediaItem;
	description?: string;
	spoiler?: boolean;
}

export interface MediaGallery {
	type: typeof ComponentType.MediaGallery;
	items: MediaGalleryItem[];
}

export interface Separator {
	type: typeof ComponentType.Separator;
	divider?: boolean;
	spacing?: (typeof SeparatorSpacing)[keyof typeof SeparatorSpacing];
}

export interface Section {
	type: typeof ComponentType.Section;
	components: TextDisplay[];
	accessory: Thumbnail | LinkButton;
}

export type ContainerChild = ActionRow | TextDisplay | Section | MediaGallery | Separator;

export interface Container {
	type: typeof ComponentType.Container;
	accent_color?: number;
	spoiler?: boolean;
	components: ContainerChild[];
}

export interface ComponentEmbed {
	component: Container;
}

export type EmbedComponent = Container | ContainerChild | LinkButton | Thumbnail;

interface ContainerOptions {
	accentColor?: number;
	spoiler?: boolean;
}

export function rgbColor(hex: string) {
	return parseInt(hex.replace('#', ''), 16);
}

function isHttpUrl(url: string) {
	return /^https?:\/\//i.test(url);
}

function media(url: string): UnfurledMediaItem {
	if (!isHttpUrl(url)) throw new Error(`Embed media must use http(s): ${url}`);
	if (url.length > maxMediaUrlLength) throw new Error(`Embed media URL is too long: ${url}`);
	return { url };
}

export function container(components: ContainerChild[], options: ContainerOptions = {}): Container {
	return {
		type: ComponentType.Container,
		...(options.accentColor !== undefined && { accent_color: options.accentColor }),
		...(options.spoiler && { spoiler: true }),
		components
	};
}

export function text(content: string): TextDisplay {
	return { type: ComponentType.TextDisplay, content };
}

export function thumbnail(url: string, description?: string): Thumbnail {
	return { type: ComponentType.Thumbnail, media: media(url), ...(description && { description }) };
}

export function gallery(items: (string | MediaGalleryItem)[]): MediaGallery {
	return {
		type: ComponentType.MediaGallery,
		items: items.map((item) => (typeof item === 'string' ? { media: media(item) } : item))
	};
}

export function separator(options: Omit<Separator, 'type'> = {}): Separator {
	return { type: ComponentType.Separator, divider: true, ...options };
}

export function section(components: TextDisplay[], accessory: Thumbnail | LinkButton): Section {
	return { type: ComponentType.Section, components, accessory };
}

export function linkButton(label: string, url: string, emoji?: string): LinkButton {
	if (!isHttpUrl(url)) throw new Error(`Link buttons must use http(s): ${url}`);
	return {
		type: ComponentType.Button,
		style: linkButtonStyle,
		label,
		url,
		...(emoji && { emoji: { name: emoji } })
	};
}

export function actionRow(buttons: LinkButton[]): ActionRow {
	return { type: ComponentType.ActionRow, components: buttons };
}

export function embed(component: Container): ComponentEmbed {
	return { component };
}

function countComponents(component: EmbedComponent) {
	let count = 1;
	if ('components' in component) {
		count += component.components.reduce((sum, child) => sum + countComponents(child), 0);
	}
	if ('accessory' in component) count += countComponents(component.accessory);
	return count;
}

export function embedSize(value: ComponentEmbed) {
	return new TextEncoder().encode(JSON.stringify(value)).length;
}

export function withinLimits(value: ComponentEmbed) {
	return countComponents(value.component) <= maxComponents && embedSize(value) <= maxPayloadBytes;
}

export function serializeEmbed(value: ComponentEmbed) {
	return JSON.stringify(value).replaceAll('</', '<\\/').replaceAll('<!--', '<\\!--');
}
