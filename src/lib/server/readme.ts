import { marked, type Token } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { TtlCache, durations } from './cache';

const requestTimeoutMs = 8000;
const readmeCache = new TtlCache<string>(durations.readme, durations.failure);
const branches = ['main', 'master'];
const videoLink = /\.(mp4|webm|mov)(\?|$)|github\.com\/user-attachments\/assets\//i;

function inlineInstallVideo(tokens: Token[]) {
	let underInstallGuide = false;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.type === 'heading') {
			underInstallGuide = token.text.trim().toLowerCase() === 'install guide';
			continue;
		}
		if (!underInstallGuide || token.type !== 'paragraph') continue;

		const link = token.tokens?.find((child) => child.type === 'link');
		if (link?.type === 'link' && videoLink.test(link.href)) {
			tokens[i] = {
				type: 'html',
				raw: token.raw,
				block: true,
				text: `<video src="${link.href}" controls preload="metadata" playsinline></video>`
			};
		}
		underInstallGuide = false;
	}
}

function absoluteUrl(value: string, base: string) {
	try {
		return new URL(value, base).href;
	} catch {
		return value;
	}
}

function sanitize(html: string, repo: string, branch: string) {
	const rawBase = `https://raw.githubusercontent.com/${repo}/${branch}/`;
	const blobBase = `https://github.com/${repo}/blob/${branch}/`;

	return sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			'img',
			'video',
			'source',
			'details',
			'summary',
			'del',
			'ins',
			'kbd',
			'picture'
		]),
		allowedAttributes: {
			'*': ['align', 'id', 'title', 'width', 'height'],
			a: ['href', 'name', 'target', 'rel'],
			img: ['src', 'srcset', 'alt', 'loading'],
			video: ['src', 'controls', 'poster', 'preload', 'loop', 'muted', 'playsinline'],
			source: ['src', 'srcset', 'type', 'media'],
			td: ['colspan', 'rowspan'],
			th: ['colspan', 'rowspan'],
			input: ['type', 'checked', 'disabled'],
			code: ['class']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowedSchemesAppliedToAttributes: ['href', 'src', 'poster'],
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					href: attribs.href ? absoluteUrl(attribs.href, blobBase) : '',
					target: '_blank',
					rel: 'noreferrer'
				}
			}),
			img: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					src: attribs.src ? absoluteUrl(attribs.src, rawBase) : '',
					loading: 'lazy'
				}
			}),
			video: (tagName, attribs) => ({
				tagName,
				attribs: { ...attribs, src: attribs.src ? absoluteUrl(attribs.src, rawBase) : '' }
			})
		}
	});
}

async function fetchReadme(repo: string) {
	for (const branch of branches) {
		const response = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/README.md`, {
			signal: AbortSignal.timeout(requestTimeoutMs)
		});

		if (response.ok) return { markdown: await response.text(), branch };
		if (response.status !== 404) throw new Error(`GitHub responded with ${response.status}`);
	}
	throw new Error(`No README found for ${repo}`);
}

async function renderReadme(repo: string) {
	const { markdown, branch } = await fetchReadme(repo);
	const tokens = marked.lexer(markdown, { gfm: true });

	inlineInstallVideo(tokens);

	const html = marked.parser(tokens, { gfm: true });
	return sanitize(html, repo, branch);
}

export function getReadme(repo: string) {
	return readmeCache.get(repo, () => renderReadme(repo));
}
