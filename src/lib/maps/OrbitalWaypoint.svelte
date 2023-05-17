<script lang='ts'>
	import Waypoint from "./Waypoint.svelte";
    import type { GraphWaypoint } from "./systemGraph";

    // Waypoint should already be scaled to the map
    export let parent: GraphWaypoint;
    export let waypoint: GraphWaypoint;
</script>

<Waypoint {waypoint} />
<line x1={parent.x} y1={parent.y} x2={waypoint.x} y2={waypoint.y} stroke="white" />
