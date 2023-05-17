import { writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { Configuration } from '$api';
import { middleware } from './spacetraders_middleware';
import type { SvelteComponent } from 'svelte';
import { Popups } from './popups';

// Store access token in local storage
export const accessToken = localStorageStore('access_token', '');
export const config = writable(new Configuration({}));
// Update config on access token change
accessToken.subscribe((value) => {
    config.set(new Configuration({
        accessToken: value,
        middleware: [middleware],
    }));
});

// svelte components
export const popups: Writable<Popups> = writable(new Popups());
