export type QuestCompatibility = 'full' | 'partial' | 'none';

export interface ApiPackage {
	name: string;
	category: string;
	latestVersion: string;
	packageInfo: {
		name: string;
		displayName?: string;
		version: string;
		description?: string;
		unity?: string;
		license?: string;
		siteUrl?: string;
		url?: string;
		unityPackageUrl?: string;
		vpmDependencies?: Record<string, string>;
		keywords?: string[];
		questCompatibility?: QuestCompatibility;
		media?: {
			previewImage?: string;
			previewGif?: string;
		};
	};
}

export interface Package {
	id: string;
	name: string;
	description: string;
	category: string;
	version: string;
	unity: string | null;
	license: string | null;
	repoUrl: string | null;
	repo: string | null;
	zipUrl: string | null;
	unityPackageUrl: string | null;
	previewImage: string | null;
	previewGif: string | null;
	quest: QuestCompatibility;
	dependencies: string[];
	keywords: string[];
}

export interface Category {
	id: string;
	name: string;
	packages: Package[];
	listingUrl: string;
	vccUrl: string;
}

export interface Listing {
	categories: Category[];
	fetchedAt: string;
}

export interface PackageStats {
	downloads: number;
	updatedAt: string | null;
}

export interface CustomListing {
	url: string;
	vccUrl: string;
}
