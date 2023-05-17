<script lang='ts'>
	import { stripWaypoint } from '$lib/utils';
	import Label from './Label.svelte';
	import OrbitalWaypoint from './OrbitalWaypoint.svelte';
    import type { GraphWaypoint } from './systemGraph';
    
    // Waypoint should already be scaled to the map
    export let waypoint: GraphWaypoint;
</script>

<circle cx={waypoint.x} cy={waypoint.y} r={5} fill="white" />
<Label anchor={waypoint} pos={waypoint.label} texts={[`${waypoint.waypoint.type} // ${stripWaypoint(waypoint.waypoint.symbol)}`]} />
{#each waypoint.orbitals as orbital}
    <OrbitalWaypoint parent={waypoint} waypoint={orbital} />
{/each}
