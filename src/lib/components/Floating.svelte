<script lang="ts">
	import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
	import { onDestroy, onMount } from 'svelte';

	export let anchor: HTMLElement | SVGElement;
	let float: HTMLElement;
    let cleanup: () => void;

    function updatePosition() {
		computePosition(anchor, float, {
			placement: 'bottom',
			middleware: [offset(10), flip(), shift({ padding: 10 })]
		}).then(({ x, y }) => {
			Object.assign(float.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
    }

	onMount(() => {
		cleanup = autoUpdate(anchor, float, updatePosition);
	});
    onDestroy(() => {
        cleanup();
    });
</script>

<div class="absolute w-max" bind:this={float}>
	<slot />
</div>
