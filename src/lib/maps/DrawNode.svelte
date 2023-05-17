<script lang="ts">
	import type { Waypoint } from "$api";
    import type { SystemNode } from "./systemGraph";
    import DrawWaypoint from "./DrawWaypoint.svelte";
    import DrawShip from "./DrawShip.svelte";
    import DrawOrbital from "./DrawOrbital.svelte";

    export let node: SystemNode;

</script>

{#if 'orbitals' in node.data}
    <DrawWaypoint waypoint={node} />
{:else}
    <DrawShip ship={node} />
{/if}
{#each node.orbitals as orbital}
    <DrawOrbital parent={node} node={orbital} />
{/each}
