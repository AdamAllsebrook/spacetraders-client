<script lang="ts">
	import type { Ship } from '$api';
	import { FleetApi } from '$api';
	import { config, popups, mode, resetMap } from '$lib/stores';
	import { onMount } from 'svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import Floating from '$lib/components/Floating.svelte';
	import Fleet from './Fleet.svelte';
	import { stripWaypoint } from '$lib/utils';

	export let ship: Ship | string;
    export let anchor: HTMLElement | SVGElement;
	let data: Ship;

	onMount(async () => {
		if (typeof ship === 'string') {
			let fleetApi = new FleetApi($config);
			let response = await fleetApi.getMyShip(ship);
			data = response.data;
		} else {
			data = ship;
		}
	});

	async function extract() {
		let fleetApi = new FleetApi($config);
		let response = await fleetApi.extractResources(data.symbol);
		if (response.data) {
			data.cargo = response.data.cargo;
			toastStore.trigger({ message: `Resources extracted, cooldown ${response.data.cooldown.remainingSeconds} seconds` });
		}
	}

	async function dock() {
		let fleetApi = new FleetApi($config);
		let response = await fleetApi.dockShip(data.symbol);
		if (response.data) {
			data.nav = response.data.nav;
			toastStore.trigger({ message: 'Docked' });
		}
	}

	async function sellAll() {
		let fleetApi = new FleetApi($config);
		while (data.cargo.inventory.length > 0) {
			let item = data.cargo.inventory[0];
			let response = await fleetApi.sellCargo(data.symbol, item);
			if (response.data) {
				data.cargo = response.data.cargo;
			}
		}
		toastStore.trigger({ message: 'Cargo sold' });
	}

    function navigate() {
        $popups.clear();
        $mode = {
            mode: 'selectWaypoint',
            callback: async (waypoint: string) => {
                $mode = { mode: 'normal' };
                let fleetApi = new FleetApi($config);
                let response = await fleetApi.navigateShip(data.symbol, {waypointSymbol: waypoint});
                if (response.data) {
                    data.nav = response.data.nav;
                    toastStore.trigger({ message: `${data.symbol} ${data.nav.flightMode} to ${stripWaypoint(data.nav.route.destination.symbol)}` });
                    $resetMap();
                }
            }
        };
    }

    function closePopup() {
        popups.update((p) => {
            p.remove(data.symbol);
            return p;
        });
    }
</script>

{#if data}
    <Floating {anchor}>
        <div class="card space-y-5 p-4">
            <h4 class="card-title">{data.registration.name}</h4>
            <p>{data.registration.role}</p>
            <p>{data.nav.status} at {data.nav.waypointSymbol}</p>

            <p>Cargo</p>
            {#each data.cargo.inventory as item}
                <p>{item.name}: {item.units}</p>
            {/each}

            <button class="btn variant-filled" on:click={extract}>
                Extract
            </button>
            {#if data.nav.status !== 'DOCKED'}
                <button class="btn variant-filled" on:click={dock}>Dock</button>
            {/if}
            {#if data.nav.status === 'DOCKED' && data.cargo.inventory.length > 0}
                <button class="btn variant-filled" on:click={sellAll}>Sell All</button>
            {/if}
            <button class='btn variant-filled' on:click={navigate}>Move</button>
            <button class='btn variant-filled' on:click={closePopup}>Close</button>
        </div>
    </Floating>
{/if}
