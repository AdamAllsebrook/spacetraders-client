<script lang='ts'>
    import { SystemsApi, type System, AgentsApi } from '$api';
    import { config } from '$lib/stores';
    import { stripSystem } from '$lib/utils';
    import { onMount } from 'svelte';

    export let system: System | string | null = null;
    let data: System;

    onMount(async () => {
        if (system === null) {
            const agentsApi = new AgentsApi($config);
            const response = await agentsApi.getMyAgent();
            system = stripSystem(response.data.headquarters);
        }
        if (typeof system === 'string') {
            const systemsApi = new SystemsApi($config);
            const response = await systemsApi.getSystem(system);
            data = response.data;
        }
        else {
            data = system;
        }
    });
</script>

{#if data}
    {#each data.waypoints as waypoint}
        <div class="card space-y-4 p-4">
            <p>{waypoint.symbol}</p>
            <p>{waypoint.type}</p>
        </div>
    {/each}
{/if}
