<script lang='ts'>
    import type { SystemNode } from "./systemGraph";
    import DrawNode from "./DrawNode.svelte";

    // Waypoint should already be scaled to the map
    export let parent: SystemNode;
    export let node: SystemNode;
</script>

<line x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} stroke="white" />
<DrawNode {node} />
