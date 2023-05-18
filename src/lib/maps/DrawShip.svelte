<script lang="ts">
	import { FleetApi, type ShipNav, type Ship as TShip } from '$api';
	import Label from './Label.svelte';
	import type { SystemNode } from './systemGraph';
    import Ship from '$lib/readouts/Ship.svelte';
    import { popups, mode, resetMap, config } from '$lib/stores';
    import { animateStore } from '$lib/utils';
	import { writable } from 'svelte/store';

	export let ship: SystemNode<TShip>;
    let anchor: SVGCircleElement;

    let inTransit = ship.data.nav.status === 'IN_TRANSIT';
    let tx = writable(ship.x);
    let ty = writable(ship.y);

    let lastNav: ShipNav | null = null;
    $: ship.data.nav, animateTransit();

    function animateTransit() {
        inTransit = ship.data.nav.status === 'IN_TRANSIT';
        if (inTransit && lastNav !== ship.data.nav) {
            lastNav = ship.data.nav;
            animateStore(
                window, 
                tx, 
                ship.data.nav.route.departure.x,
                ship.data.nav.route.destination.x,
                Date.parse(ship.data.nav.route.departureTime),
                Date.parse(ship.data.nav.route.arrival),
                () => {
                    const fleetApi = new FleetApi($config);
                    fleetApi.getShipNav(ship.data.symbol).then((response) => {
                        ship.data.nav = response.data;
                        $resetMap();
                    });
                }
            );
            animateStore(
                window,
                ty,
                ship.data.nav.route.departure.y, 
                ship.data.nav.route.destination.y, 
                Date.parse(ship.data.nav.route.departureTime), 
                Date.parse(ship.data.nav.route.arrival)
            );
        }
    }

    function showPopup() {
        if ($mode.mode !== 'normal') return;
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

{#if ship.data.nav.status === 'IN_TRANSIT' 
    && ship.data.nav.route.destination.systemSymbol === ship.data.nav.systemSymbol
    && ship.data.nav.route.departure.systemSymbol === ship.data.nav.systemSymbol
}
    <line
        x1={ship.data.nav.route.departure.x}
        y1={ship.data.nav.route.departure.y}
        x2={ship.data.nav.route.destination.x}
        y2={ship.data.nav.route.destination.y}
        class="stroke-secondary-400"
        stroke-width="1"
        stroke-dasharray="5 5"
    />
{/if}
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
	cx={inTransit ? $tx : ship.x}
	cy={inTransit ? $ty : ship.y}
	r={5}
    class="cursor-pointer fill-primary-400"
    bind:this={anchor}
    on:click={showPopup}
    on:keydown={(e) => {
        if (e.key === 'Enter') showPopup();
    }}
/>
