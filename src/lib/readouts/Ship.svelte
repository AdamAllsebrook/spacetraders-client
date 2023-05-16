<script lang='ts'>
    import type { Ship } from '$api';
    import { FleetApi } from '$api';
    import { config } from '$lib/stores';
    import { onMount } from 'svelte';
    import { toastStore } from '@skeletonlabs/skeleton';

    export let ship: Ship | string;
    let data: Ship;

    onMount(async () => {
        if (typeof ship === 'string') {
            let fleetApi = new FleetApi($config);
            let response = await fleetApi.getMyShip(ship);
            data = response.data;
        }
        else {
            data = ship;
        }
        console.log(data);
    });

    async function extract() {
        let fleetApi = new FleetApi($config);
        let response = await fleetApi.extractResources(data.symbol);
        if (response.data) {
            toastStore.trigger({message: 'Resources extracted'});
        }
    }
</script>

{#if data}
    <div class="card space-y-5 p-4">
        <h4 class="card-title">{data.registration.name}</h4>
        <p>{data.registration.role}</p>
        <p>{data.nav.status} at {data.nav.waypointSymbol}</p>
        <button class='btn variant-filled' on:click={extract}>Extract</button>
    </div>
{/if}
