<script lang='ts'>
	import type { Waypoint } from '$api';
	import { stripWaypoint } from '$lib/utils';
	import Label from './Label.svelte';
    import type { SystemNode } from './systemGraph';
    import { mode } from '$lib/stores';

    export let waypoint: SystemNode<Waypoint>;

    function select() {
        if ($mode.mode !== 'selectWaypoint') return;
        $mode.callback(waypoint.data.symbol);
    }
</script>

<circle 
    cx={waypoint.x} 
    cy={waypoint.y} 
    r={5 + waypoint.orbitals.length} 
    fill="white" 
    class="cursor-pointer"
    on:click={select} 
    on:keydown={(e) => {
        if (e.key === 'Enter') select();
    }}
/>
<Label 
    anchor={waypoint} 
    pos={waypoint.label} 
    texts={[`${waypoint.data.type} // ${stripWaypoint(waypoint.data.symbol)}`]} 
    on:click={select} 
    on:keydown={(e) => {
        if (e.key === 'Enter') select();
    }}
/>
