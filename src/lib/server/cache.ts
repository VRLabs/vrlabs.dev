interface Ok<T> {
	ok: true;
	value: T;
}

interface Failed {
	ok: false;
	error: unknown;
}

interface Entry<T> {
	result: Ok<T> | Failed;
	expiresAt: number;
	pending: Promise<T> | null;
}

export interface RetryAfterError extends Error {
	retryAt?: number;
}

function retryAt(error: unknown) {
	const value = (error as RetryAfterError | null)?.retryAt;
	return typeof value === 'number' ? value : 0;
}

export class TtlCache<T> {
	#entries = new Map<string, Entry<T>>();

	constructor(
		private readonly ttlMs: number,
		private readonly failureTtlMs: number
	) {}

	async get(key: string, load: () => Promise<T>): Promise<T> {
		const entry = this.#entries.get(key);

		if (entry && entry.expiresAt > Date.now()) {
			if (entry.result.ok) return entry.result.value;
			throw entry.result.error;
		}

		if (entry?.result.ok) {
			this.#refresh(key, entry, entry.result.value, load);
			return entry.result.value;
		}

		return this.#load(key, entry, load);
	}

	#store(key: string, result: Ok<T> | Failed, expiresAt: number) {
		this.#entries.set(key, { result, expiresAt, pending: null });
	}

	#failureExpiry(error: unknown) {
		return Math.max(Date.now() + this.failureTtlMs, retryAt(error));
	}

	#load(key: string, entry: Entry<T> | undefined, load: () => Promise<T>) {
		if (entry?.pending) return entry.pending;

		const pending = load().then(
			(value) => {
				this.#store(key, { ok: true, value }, Date.now() + this.ttlMs);
				return value;
			},
			(error) => {
				this.#store(key, { ok: false, error }, this.#failureExpiry(error));
				throw error;
			}
		);

		this.#entries.set(key, {
			result: entry?.result ?? { ok: false, error: undefined },
			expiresAt: 0,
			pending
		});
		return pending;
	}

	#refresh(key: string, entry: Entry<T>, stale: T, load: () => Promise<T>) {
		if (entry.pending) return;

		entry.pending = load().then(
			(value) => {
				this.#store(key, { ok: true, value }, Date.now() + this.ttlMs);
				return value;
			},
			(error) => {
				console.error(`Cache refresh failed for ${key}, serving the stale value`, error);
				entry.expiresAt = this.#failureExpiry(error);
				entry.pending = null;
				return stale;
			}
		);
	}
}

const minute = 60 * 1000;

export const durations = {
	packages: 5 * minute,
	stats: 2 * 60 * minute,
	readme: 30 * minute,
	failure: minute
};
