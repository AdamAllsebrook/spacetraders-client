<script lang="ts">
	import PopupsContainer from '$lib/components/PopupsContainer.svelte';
import EnterAcessToken from '$lib/forms/EnterAcessToken.svelte';
	import SystemMap from '$lib/maps/SystemMap.svelte';
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

<svelte:window bind:innerWidth bind:innerHeight />
{#if isMounted && $accessToken == ''}
    <EnterAcessToken />
{:else}
    <svg width={bounds.right - bounds.left} height={bounds.bottom - bounds.top}>
        <SystemMap {bounds} />
    </svg>
    <PopupsContainer />
{/if}


