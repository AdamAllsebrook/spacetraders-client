<script lang="ts">
    export let texts: Array<string> = [];
    export let pos = {x: 0, y: 0};
    export let anchor = {x: 0, y: 0};

    let el: SVGElement;
    let bbox: DOMRect;
    $: pos, bbox = el?.getBoundingClientRect();

    $: dir = pos.x < anchor.x ? 'left' : 'right';
</script>

<g bind:this={el} on:click on:keydown class='cursor-pointer'>
    {#each texts as text, i}
        <text x={pos.x} y={pos.y + i * 20} text-anchor={dir == 'left' ? 'end' : 'start'} font-size="1em" fill="white">{text}</text>
    {/each}
</g>
{#if bbox}
    <line x1={anchor.x} y1={anchor.y} x2={dir == 'left' ? bbox.right : bbox.left} y2={bbox.bottom} stroke="white" />
    <line x1={bbox.left} y1={bbox.bottom} x2={bbox.right} y2={bbox.bottom} stroke="white" />
{/if}
