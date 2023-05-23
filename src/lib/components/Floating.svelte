<script lang="ts">
	import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

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

    function onClick(e: MouseEvent) {
        if (!float.contains(e.target as Node)) {
            dispatch('clickout', e);
        }
    }

	onMount(() => {
		cleanup = autoUpdate(anchor, float, updatePosition);
	});
    onDestroy(() => {
        cleanup();
    });
</script>

<svelte:window on:mouseup={onClick} />
<div class="floating" bind:this={float}>
	<slot />
</div>
