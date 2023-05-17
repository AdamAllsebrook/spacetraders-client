<script lang="ts">
	import { SystemsApi, type System, AgentsApi, FleetApi, type Waypoint as TWaypoint } from '$api';
	import { config } from '$lib/stores';
	import { stripSystem, stripWaypoint, type Box } from '$lib/utils';
	import { SYSTEM_MAX_X, SYSTEM_MAX_Y } from '$lib/constants';
	/* ts-ignore */
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import Label from './Label.svelte';
	import ForceSimulation from './ForceSimulation.svelte';
    import Waypoint from './Waypoint.svelte';
	import { writable, type Writable } from 'svelte/store';
    import { type GraphWaypoint, systemGraph } from './systemGraph'

	export let system: System | string | null = null;
	export let bounds: Box;
	let data: Array<TWaypoint> = [];
    let graph: Writable<Array<GraphWaypoint>> = writable([]);
    $: scale = {
        x: d3
            .scaleLinear()
            .domain([-SYSTEM_MAX_X, SYSTEM_MAX_X])
            .range([bounds.left, bounds.right]),
        y: d3
            .scaleLinear()
            .domain([-SYSTEM_MAX_Y, SYSTEM_MAX_Y])
            .range([bounds.top, bounds.bottom])
    };
	onMount(async () => {
		if (system === null) {
			const agentsApi = new AgentsApi($config);
			const response = await agentsApi.getMyAgent();
			system = stripSystem(response.data.headquarters);
		}
        else if (typeof system === 'object') {
            system = stripSystem(system.symbol);
        }
        const systemsApi = new SystemsApi($config);
        const response = await systemsApi.getSystemWaypoints(system);
        data = response.data;
        graph = writable(systemGraph(data, scale));

	});
</script>

<filter id="radar">
	<feGaussianBlur stdDeviation="0.5" />
</filter>

<g filter="url(#radar)">
	{#if $graph}
		{#each $graph as waypoint}
			<Waypoint {waypoint} />
		{/each}
	{/if}
</g>
{#if $graph.length > 0 }
	<ForceSimulation {bounds} bind:graph />
{/if}
