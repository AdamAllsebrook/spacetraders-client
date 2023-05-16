<script lang="ts">
	import { SystemsApi, type System, AgentsApi, type Waypoint } from '$api';
	import { config } from '$lib/stores';
	import { stripSystem, stripWaypoint, type Box } from '$lib/utils';
	import { SYSTEM_MAX_X, SYSTEM_MAX_Y } from '$lib/constants';
	/* ts-ignore */
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import Label from './Label.svelte';
	import ForceSimulation from './ForceSimulation.svelte';
	import { writable, type Writable } from 'svelte/store';

	export let system: System | string | null = null;
	export let bounds: Box;
	let data: Array<Waypoint> = [];
	$: xScale = d3
		.scaleLinear()
		.domain([-SYSTEM_MAX_X, SYSTEM_MAX_X])
		.range([bounds.left, bounds.right]);
	$: yScale = d3
		.scaleLinear()
		.domain([-SYSTEM_MAX_Y, SYSTEM_MAX_Y])
		.range([bounds.top, bounds.bottom]);

    let nodes: Writable<any> = writable([]);
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
        nodes.set(data.map((waypoint) => {
            return {
                id: waypoint.symbol,
                x: xScale(waypoint.x),
                y: yScale(waypoint.y),
            };
        }));
        const response2 = await systemsApi.getSystem(system);
        console.log(response2.data);
	});
</script>

<filter id="radar">
	<feGaussianBlur stdDeviation="0.5" />
</filter>

<g filter="url(#radar)">
	{#if data}
		{#each data as waypoint}
            {@const x = xScale(waypoint.x)}
            {@const y = yScale(waypoint.y)}
            {@const node = $nodes.find((node) => node.id === waypoint.symbol)}
			<circle cx={x} cy={y} r={5} fill="white" />
            <Label anchor={{x, y}} pos={node} texts={[`${waypoint.type} // ${stripWaypoint(waypoint.symbol)}`]} />
		{/each}
	{/if}
</g>
{#if $nodes.length > 0}
    <ForceSimulation {bounds} bind:nodes={nodes}/>
{/if}
