<script lang="ts">
	import { SystemsApi, type System, AgentsApi, FleetApi, type Waypoint as TWaypoint, type Ship } from '$api';
	import { config, resetMap } from '$lib/stores';
	import { stripSystem, type Box } from '$lib/utils';
	import { SYSTEM_MAX_X, SYSTEM_MAX_Y } from '$lib/constants';
	/* ts-ignore */
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
    import {  SystemGraph } from './systemGraph'
    import { ForceSimulation } from './forceSimulation';
	import DrawNode from './DrawNode.svelte';
    import { setContext } from 'svelte';

	export let system: System | string | null = null;
	export let bounds: Box;

	let waypoints: Array<TWaypoint> = [];
    let ships: Array<Ship> = [];
    let graph = writable(new SystemGraph({ x: d3.scaleLinear(), y: d3.scaleLinear() }));
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
    $: scale, $resetMap();
    const simulation = new ForceSimulation();
    setContext('system-simulation', simulation);
    setContext('system-graph', graph);

    function init() {
        graph.set(new SystemGraph(scale));
        $graph.addWaypoints(waypoints);
        $graph.addShips(ships);
        simulation.init(graph);
   } 

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
        waypoints = response.data;

        const fleetApi = new FleetApi($config);
        const fleetResponse = await fleetApi.getMyShips();
        ships = fleetResponse.data;

        $resetMap = init;
	});
</script>

<filter id="radar">
	<feGaussianBlur stdDeviation="0.2" />
</filter>

<g filter="url(#radar)">
	{#if $graph}
		{#each $graph.graph as node}
			<DrawNode {node} />
		{/each}
	{/if}
</g>
