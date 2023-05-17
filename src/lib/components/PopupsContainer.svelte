<script lang="ts">
    import { popups } from '$lib/stores';
	import { onMount } from 'svelte';

    let container: HTMLDivElement;

</script>

<div class='absolute left-0 top-0'>
    {#each Array.from($popups.popups.values()) as {component, props}}
        <svelte:component this={component} {...props} />
    {/each}
</div>
