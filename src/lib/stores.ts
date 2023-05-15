import { writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';

// Store access token in local storage
export const accessToken = localStorageStore('access_token', '');

