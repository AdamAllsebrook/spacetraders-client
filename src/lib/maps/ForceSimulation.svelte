<script lang="ts">
	import type { Box } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Writable } from 'svelte/store';
	import { afterUpdate } from 'svelte';

	type ForceNode = {
		id: any;
		x: number;
		y: number;
		vx: number;
		vy: number;
		anchorX?: number;
		anchorY?: number;
	};

	export let bounds: Box;
	export let nodes: Writable<Array<ForceNode>>;

	let simulation: any;
	let nodeList: Array<ForceNode>;
	onMount(() => {
		nodeList = [...$nodes];
        nodeList = nodeList.map((node) => {
            return {
                ...node,
                anchorX: node.x,
                anchorY: node.y,
            };
        });
		nodeList = nodeList.concat(
			nodeList.map((node) => {
				return {
					id: node.id + 'anchor',
					x: node.x,
					y: node.y,
					vx: 0,
					vy: 0,
					fx: node.x,
					fy: node.y
				};
			})
		);
		let links = Array.from({ length: $nodes.length }, (_, i) => {
			return {
				source: i,
				target: i + $nodes.length
			};
		});
		simulation = d3
			.forceSimulation(nodeList)
			.force('charge', d3.forceManyBody().strength(-70).distanceMax(100).distanceMin(5))
			// .force(
			// 	'center',
			// 	d3.forceCenter(
			// 		bounds.left + (bounds.right - bounds.left) / 2,
			// 		bounds.top + (bounds.bottom - bounds.top) / 2
			// 	)
			// )
			.force('collision', d3.forceCollide().radius(1))
			.force('link', d3.forceLink(links).distance(60))
            .alphaDecay(0.1)
			.on('tick', () => {
				nodes.set(nodeList);
			});
	});
</script>
