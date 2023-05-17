<script lang="ts">
	import type { Box } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Writable } from 'svelte/store';
    import type { SystemGraph } from './systemGraph';

	type ForceNode = {
		id: any;
		x: number;
		y: number;
        fx?: number;
        fy?: number;
	};

	export let bounds: Box;
    export let graph: Writable<SystemGraph>;

	let simulation: any;
	let nodes: Array<ForceNode>;
	onMount(() => {
        nodes = [];
        $graph.forEach((node) => {
            nodes.push({
                id: node.data.symbol,
                x: node.x,
                y: node.y,
            });
            nodes.push({
                id: node.data.symbol + 'fixed',
                x: node.x,
                y: node.y,
                fx: node.x,
                fy: node.y,
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
                    $graph.forEach((node) => {
                        node.label.x = index[node.data.symbol].x;
                        node.label.y = index[node.data.symbol].y;
                    });
                    return graph;
                });
			});
	});
</script>
