<script lang='ts'>
	import type { Waypoint } from '$api';
	import { stripWaypoint } from '$lib/utils';
	import Label from './Label.svelte';
	import DrawOrbital from './DrawOrbital.svelte';
    import type { SystemNode } from './systemGraph';

    export let waypoint: SystemNode<Waypoint>;
</script>

<circle cx={waypoint.x} cy={waypoint.y} r={5} fill="white" />
<Label anchor={waypoint} pos={waypoint.label} texts={[`${waypoint.data.type} // ${stripWaypoint(waypoint.data.symbol)}`]} />
