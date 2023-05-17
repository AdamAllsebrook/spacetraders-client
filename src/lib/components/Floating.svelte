<script lang="ts">
    import { computePosition } from '@floating-ui/dom'

    export let pos: { x: number; y: number };
</script>

<div class="absolute w-max" style="left: {pos.x}px; top: {pos.y}px;">
    <slot />
</div>
