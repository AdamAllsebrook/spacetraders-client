<script lang="ts">
	import type { Box } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Writable } from 'svelte/store';
    import type { GraphWaypoint } from './systemGraph';
	import { afterUpdate } from 'svelte';

	type ForceNode = {
		id: any;
		x: number;
		y: number;
        fx?: number;
        fy?: number;
	};

	export let bounds: Box;
    export let graph: Writable<Array<GraphWaypoint>>;

	let simulation: any;
	let nodes: Array<ForceNode>;
	onMount(() => {
        nodes = [];
        $graph.forEach((node) => {
            [node, ...node.orbitals].forEach((waypoint) => {
                nodes.push({
                    id: waypoint.waypoint.symbol,
                    x: waypoint.x,
                    y: waypoint.y,
                });
                nodes.push({
                    id: waypoint.waypoint.symbol + 'fixed',
                    x: waypoint.x,
                    y: waypoint.y,
                    fx: waypoint.x,
                    fy: waypoint.y,
                });
            });
        });
        let links = [...Array(nodes.length / 2).keys()].map((i) => {
            return {
                source: i * 2,
                target: i * 2 + 1,
            };
        });

		simulation = d3
			.forceSimulation(nodes)
			.force('charge', d3.forceManyBody().strength(-70).distanceMax(100).distanceMin(5))
			.force('collision', d3.forceCollide().radius(1))
			.force('link', d3.forceLink(links).distance(40))
            .alphaDecay(0.1)
			.on('tick', () => {
                let index = Object.fromEntries(nodes.map((x) => [x.id, x]));
                graph.update((graph) => {
                    graph.forEach((node) => {
                        node.label.x = index[node.waypoint.symbol].x;
                        node.label.y = index[node.waypoint.symbol].y;
                        node.orbitals.forEach((orbital) => {
                            orbital.label.x = index[orbital.waypoint.symbol].x;
                            orbital.label.y = index[orbital.waypoint.symbol].y;
                        });
                    });
                    return graph;
                });
			});
	});
</script>
