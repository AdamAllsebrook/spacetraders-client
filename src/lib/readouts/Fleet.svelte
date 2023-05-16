<script lang='ts'>
    import { FleetApi } from '$api';
    import type { Ship as TShip } from '$api';
    import { config } from '$lib/stores';
    import { onMount } from 'svelte';
	import Ship from './Ship.svelte';

    let ships: TShip[] = [];
    onMount(async () => {
        const fleetApi = new FleetApi($config);
        const response = await fleetApi.getMyShips();
        ships = response.data;
    });

</script>

{#each ships as ship}
    <Ship {ship} />
{/each}
