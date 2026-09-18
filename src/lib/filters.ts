import type { Category, Package } from './types';

export type QuestFilter = 'any' | 'compatible' | 'full';

export interface PackageFilters {
	query: string;
	category: string;
	quest: QuestFilter;
}

function matchesQuest(pkg: Package, quest: QuestFilter) {
	if (quest === 'any') return true;
	if (quest === 'full') return pkg.quest === 'full';
	return pkg.quest !== 'none';
}

function matchesQuery(pkg: Package, needle: string) {
	if (!needle) return true;
	return [pkg.name, pkg.id, pkg.description, ...pkg.keywords].some((text) =>
		text.toLowerCase().includes(needle)
	);
}

export function filterCategories(categories: Category[], filters: PackageFilters) {
	const needle = filters.query.trim().toLowerCase();

	return categories
		.filter((category) => filters.category === 'all' || category.id === filters.category)
		.map((category) => ({
			...category,
			packages: category.packages.filter(
				(pkg) => matchesQuest(pkg, filters.quest) && matchesQuery(pkg, needle)
			)
		}))
		.filter((category) => category.packages.length > 0);
}
