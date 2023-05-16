<script lang="ts">
	import EnterAcessToken from '$lib/forms/EnterAcessToken.svelte';
	import Fleet from '$lib/readouts/Fleet.svelte';
	import { accessToken } from '$lib/stores';
	import { onMount } from 'svelte';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});
</script>

<div class="container mx-auto flex h-full items-center justify-center">
	<div class="container space-y-5">
		{#if isMounted && $accessToken == ''}
			<EnterAcessToken />
		{/if}
        <Fleet />
	</div>
</div>

