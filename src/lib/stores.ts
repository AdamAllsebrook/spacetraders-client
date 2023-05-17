import { writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { Configuration } from '$api';
import { middleware } from './spacetraders_middleware';
import { Popups } from './popups';
import type { AllModes } from './modes';

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

export const popups: Writable<Popups> = writable(new Popups());
export const mode: Writable<AllModes> = writable({ mode: 'normal' });
