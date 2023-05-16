<script lang="ts">
	import EnterAcessToken from '$lib/forms/EnterAcessToken.svelte';
	import SystemMap from '$lib/maps/SystemMap.svelte';
	import Fleet from '$lib/readouts/Fleet.svelte';
	import System from '$lib/readouts/System.svelte';
	import { accessToken } from '$lib/stores';
	import { onMount } from 'svelte';

	let isMounted = false;
    let innerWidth = 300;
    let innerHeight = 300;
    $: bounds = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };

	onMount(() => {
		isMounted = true;
	});
</script>

<!-- <div class="container space-y-4 p-4"> -->
<!--     {#if isMounted && $accessToken == ''} -->
<!--         <EnterAcessToken /> -->
<!--     {/if} -->
<!--     <Fleet /> -->
<!--     <System /> -->
<!-- </div> -->
<!---->

<svelte:window bind:innerWidth bind:innerHeight />
<svg width={bounds.right - bounds.left} height={bounds.bottom - bounds.top}>
    <SystemMap {bounds} />
</svg>
