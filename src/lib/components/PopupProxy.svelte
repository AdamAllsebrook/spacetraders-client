<script lang="ts">
	import Ship from "$lib/readouts/Ship.svelte";
import { popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import type { SvelteComponent } from "svelte";
	import { onMount } from "svelte";

    export let pos: { x: number; y: number };
    export let popupSettings: PopupSettings;
    let button: HTMLButtonElement;
    let isMounted = false;

    onMount(() => {
        isMounted = true;
    });

    export function click() {
        button.click();
    }
</script>

{#if isMounted}
    <button
    bind:this={button}
    class="absoulte hidden"
    style="left: {pos.x}px; top: {pos.y}px;"
    use:popup={popupSettings}
    />
{/if}
