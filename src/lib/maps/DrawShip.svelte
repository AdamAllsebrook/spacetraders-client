<script lang="ts">
	import type { Ship as TShip } from '$api';
	import Label from './Label.svelte';
	import type { SystemNode } from './systemGraph';
    import Ship from '$lib/readouts/Ship.svelte';
    import { popups } from '$lib/stores';

	export let ship: SystemNode<TShip>;
    let anchor: SVGCircleElement;

    function showPopup() {
        popups.update((p) => {
            p.add(
                ship.data.symbol,
                Ship,
                {
                    ship: ship.data,
                    anchor,
                }
            );
            return p;
        });
    }

</script>

<Label
    anchor={ship}
    pos={ship.label}
    texts={[`${ship.data.symbol} // ${ship.data.nav.status}`]} 
    on:click={showPopup}
    on:keydown={(e) => {
        if (e.key === 'Enter') showPopup();
    }}
/>
<circle
	cx={ship.x}
	cy={ship.y}
	r={5}
	fill="red"
    class="cursor-pointer"
    bind:this={anchor}
    on:click={showPopup}
    on:keydown={(e) => {
        if (e.key === 'Enter') showPopup();
    }}
/>
