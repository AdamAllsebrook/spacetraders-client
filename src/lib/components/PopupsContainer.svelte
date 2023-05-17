<script lang="ts">
    import { popups, mode } from '$lib/stores';

</script>

<div class='absolute left-0 top-0'>
    {#if $mode.mode === 'normal'}
        {#each Array.from($popups.popups.values()) as {component, props}}
            <svelte:component this={component} {...props} />
        {/each}
    {/if}
</div>
