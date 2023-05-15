<script lang="ts">
	import { accessToken } from '$lib/stores';

	function handleSubmitToken(event: Event) {
		const form = event.target as HTMLFormElement;
		const data = new FormData(form);
		const value = data.get('access_token') as string;
		accessToken.set(value);
	}
</script>

<div class="container mx-auto flex h-full items-center justify-center">
	<div class="container space-y-5">
		<form class="space-y-5" on:submit|preventDefault={handleSubmitToken}>
			<label class="label" for="access_token">Access Token</label>
			<input class="input" type="text" name="access_token" />
			<button class="btn variant-filled" type="submit">Enter access token</button>
		</form>
	</div>
</div>
