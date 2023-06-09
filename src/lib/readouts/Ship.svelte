<script lang="ts">
	import type { Ship } from '$api';
	import { FleetApi } from '$api';
	import { config, popups, mode, resetMap } from '$lib/stores';
	import { getContext, onMount } from 'svelte';
	import { Tab, TabGroup, toastStore, type TableSource, tableMapperValues, Table } from '@skeletonlabs/skeleton';
	import Floating from '$lib/components/Floating.svelte';
	import Fleet from './Fleet.svelte';
	import { stripWaypoint, capitalize } from '$lib/utils';
	import type { SystemGraph, SystemNode } from '$lib/maps/systemGraph';
	import type { Writable } from 'svelte/store';
    import type { ForceSimulation } from '$lib/maps/forceSimulation';

	export let ship: Ship | string;
    export let anchor: HTMLElement | SVGElement;
	let data: Ship;

    export let graph: Writable<SystemGraph>;
    export let simulation: ForceSimulation;

    let tab = 0;
    $: cargoTable = data ? {
        head: ['Name', 'Units'],
        body: tableMapperValues(data.cargo.inventory, ['name', 'units'])
    } as TableSource : null;

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

                    const newShip = $graph.updateShip(data);
                    if (newShip) simulation.updateNode(newShip);
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
    console.log(ship);
</script>

{#if data}
    <Floating {anchor} on:clickout={closePopup}>
        <div class="variant-glass-surface variant-ringed-secondary rounded-sm p-4">
            <h3 class="h3 text-center">{data.registration.name}</h3>
            <TabGroup justify="justify-center" padding="px-2 py-1">
                <Tab bind:group={tab} name="Overview" value={0}>Overview</Tab>
                <Tab bind:group={tab} name="Cargo" value={1}>Cargo</Tab>
                <svelte:fragment slot="panel">
                    {#if tab == 0}
                        <div class="space-y-4">
                            <div>
                                <p>{capitalize(data.registration.role)}</p>
                                <p>{data.nav.waypointSymbol} - {data.nav.status}</p>
                            </div>
                            <div>
                                <p>&nbsp;Fuel: {(data.fuel.current / data.fuel.capacity * 100).toFixed(0)}% ({data.fuel.current}/{data.fuel.capacity})</p>
                                <p>Cargo: {(data.cargo.units / data.cargo.capacity * 100).toFixed(0)}% ({data.cargo.units}/{data.cargo.capacity})</p>
                            </div>
                            <div class="pt-2">
                                <button class="btn bg-gradient-to-br variant-gradient-tertiary-primary" on:click={extract}>
                                    Extract
                                </button>
                                {#if data.nav.status !== 'DOCKED'}
                                    <button class="btn variant-soft-primary" on:click={dock}>Dock</button>
                                {/if}
                                {#if data.nav.status === 'DOCKED' && data.cargo.inventory.length > 0}
                                    <button class="btn variant-soft-primary" on:click={sellAll}>Sell All</button>
                                {/if}
                                <button class='btn variant-soft-primary' on:click={navigate}>Move</button>
                                <button class='btn variant-soft-primary' on:click={closePopup}>Close</button>
                            </div>
                        </div>
                    {:else if tab == 1}
                        <Table source={cargoTable} />
                    {/if}
                </svelte:fragment>
            </TabGroup>
        </div>
    </Floating>
{/if}
