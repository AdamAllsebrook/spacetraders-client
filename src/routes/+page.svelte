<script lang="ts">
	import EnterAcessToken from '$lib/forms/EnterAcessToken.svelte';
	import Fleet from '$lib/readouts/Fleet.svelte';
	import System from '$lib/readouts/System.svelte';
	import { accessToken } from '$lib/stores';
	import { onMount } from 'svelte';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
</script>

<div class="container space-y-4 p-4">
    {#if isMounted && $accessToken == ''}
        <EnterAcessToken />
    {/if}
    <Fleet />
    <System />
</div>

