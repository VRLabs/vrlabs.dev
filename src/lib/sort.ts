import type { Package, PackageStats, QuestCompatibility } from './types';

export type SortKey = 'default' | 'name' | 'downloads' | 'updated' | 'quest';

export type StatsMap = Map<string, PackageStats | null>;

const questRank: Record<QuestCompatibility, number> = { full: 0, partial: 1, none: 2 };

export function needsStats(sort: SortKey) {
	return sort === 'downloads' || sort === 'updated';
}

function timestamp(iso: string | null | undefined) {
	return iso ? new Date(iso).getTime() : 0;
}

export function sortPackages(packages: Package[], sort: SortKey, stats: StatsMap | null) {
	const list = [...packages];
	const statsOf = (pkg: Package) => stats?.get(pkg.id) ?? null;

	switch (sort) {
		case 'name':
			return list.sort((a, b) => a.name.localeCompare(b.name));
		case 'downloads':
			return list.sort((a, b) => (statsOf(b)?.downloads ?? -1) - (statsOf(a)?.downloads ?? -1));
		case 'updated':
			return list.sort(
				(a, b) => timestamp(statsOf(b)?.updatedAt) - timestamp(statsOf(a)?.updatedAt)
			);
		case 'quest':
			return list.sort((a, b) => questRank[a.quest] - questRank[b.quest]);
		default:
			return list;
	}
}
