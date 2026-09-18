import { browser } from '$app/environment';
import type { Package } from './types';

export interface CartItem {
	id: string;
	name: string;
	dependencies: string[];
}

const storageKey = 'basket';

function readStorage(): CartItem[] {
	if (!browser) return [];

	try {
		const raw = localStorage.getItem(storageKey);
		const parsed = raw ? (JSON.parse(raw) as unknown) : [];
		if (!Array.isArray(parsed)) return [];

		return parsed
			.filter((item): item is CartItem => typeof item?.id === 'string')
			.map((item) => ({
				id: item.id,
				name: typeof item.name === 'string' ? item.name : item.id,
				dependencies: Array.isArray(item.dependencies) ? item.dependencies : []
			}));
	} catch {
		return [];
	}
}

function writeStorage(items: CartItem[]) {
	if (!browser) return;
	try {
		localStorage.setItem(storageKey, JSON.stringify(items));
	} catch {
		// storage can be unavailable in private windows
	}
}

export class Cart {
	items = $state<CartItem[]>([]);
	open = $state(false);

	constructor() {
		this.items = readStorage();
	}

	get count() {
		return this.items.length;
	}

	get ids() {
		const ids: string[] = [];

		for (const item of this.items) {
			for (const id of [...item.dependencies, item.id]) {
				if (!ids.includes(id)) ids.push(id);
			}
		}
		return ids;
	}

	has(id: string) {
		return this.items.some((item) => item.id === id);
	}

	add(pkg: Pick<Package, 'id' | 'name' | 'dependencies'>) {
		if (this.has(pkg.id)) return false;

		this.items.push({ id: pkg.id, name: pkg.name, dependencies: pkg.dependencies });
		writeStorage(this.items);

		return true;
	}

	remove(id: string) {
		this.items = this.items.filter((item) => item.id !== id);
		writeStorage(this.items);
	}

	clear() {
		this.items = [];
		writeStorage(this.items);
	}
}

export const cart = new Cart();
