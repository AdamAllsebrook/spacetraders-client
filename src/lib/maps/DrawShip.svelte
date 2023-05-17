<script lang="ts">
	import type { Ship } from "$api";
	import { stripWaypoint } from "$lib/utils";
	import Label from "./Label.svelte";
	import type { SystemNode } from "./systemGraph";

    export let ship: SystemNode<Ship>;
</script>

<Label anchor={ship} pos={ship.label} texts={[`${ship.data.symbol} // ${ship.data.nav.status}`]} />
<circle cx={ship.x} cy={ship.y} r={5} fill="red" />
