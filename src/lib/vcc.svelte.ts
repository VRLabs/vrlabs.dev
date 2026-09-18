import type { CustomListing } from './types';

export class VccLauncher {
	listing = $state<CustomListing | null>(null);
	loading = $state(false);
	error = $state<string | null>(null);

	async launch(create: () => Promise<CustomListing>) {
		this.error = null;
		this.listing = null;
		this.loading = true;

		try {
			const listing = await create();
			this.listing = listing;
			window.location.assign(listing.vccUrl);
		} catch (error) {
			console.error(error);
			this.error = 'The package listing could not be created. Please try again later.';
		} finally {
			this.loading = false;
		}
	}

	close() {
		this.listing = null;
		this.loading = false;
		this.error = null;
	}
}

export const vcc = new VccLauncher();
