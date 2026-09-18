import type { QuestCompatibility } from './types';

export function formatCount(count: number) {
	return count.toLocaleString('en-US');
}

export function formatDate(iso: string | null) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export const questLabels: Record<QuestCompatibility, string> = {
	full: 'Quest compatible',
	partial: 'Partially Quest compatible',
	none: 'Not Quest compatible'
};

export function listParam(params: URLSearchParams, name: string) {
	return params
		.getAll(name)
		.flatMap((value) => value.split(','))
		.map((value) => value.trim())
		.filter(Boolean);
}
