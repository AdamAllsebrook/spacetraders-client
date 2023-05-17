<script lang="ts">
	import type { Ship as TShip } from '$api';
	import Label from './Label.svelte';
	import type { SystemNode } from './systemGraph';
	import { onMount } from 'svelte';
    import Ship from '$lib/readouts/Ship.svelte';

	export let ship: SystemNode<TShip>;
	let hover = false;
    let popup: Ship | null;

    function showPopup() {
        if (popup) return;
        const container = document.getElementById('popupContainer');
        if (!container) return;
        popup = new Ship({
            target: container,
            props: {
                ship: ship.data,
                pos: { x: ship.x, y: ship.y },
            }
        });
    }

</script>

<Label anchor={ship} pos={ship.label} texts={[`${ship.data.symbol} // ${ship.data.nav.status}`]} />
<circle
	cx={ship.x}
	cy={ship.y}
	r={hover ? 6 : 5}
	fill="red"
	on:mouseover={() => (hover = true)}
	on:focus={() => (hover = true)}
	on:mouseout={() => (hover = false)}
	on:blur={() => (hover = false)}
    on:click={() => showPopup()}
    on:keydown={(e) => {
        if (e.key === 'Enter') showPopup();
    }}
/>
