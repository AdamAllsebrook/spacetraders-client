<script lang="ts">
	import EnterAcessToken from '$lib/forms/EnterAcessToken.svelte';
	import { accessToken } from '$lib/stores';
	import { onMount } from 'svelte';

	let isMounted = false;
	onMount(() => {
		isMounted = true
	});
</script>

{#if isMounted && $accessToken == ''}
	<EnterAcessToken />
{/if}
