<script lang="ts">
	export let capacity: number;
	export let current: number;
</script>

<div class="border-secondary-700 border relative h-16 rounded-sm" style="aspect-ratio: 9 / 16;">
	<div class="absolute bottom-0 left-0 right-0 top-0 m-1">
		<div
			class="variant-gradient-tertiary-primary absolute bottom-0 rounded-sm bg-gradient-to-br"
			style="width: 100%; height: {(current / capacity) * 100}%"
		/>
	</div>
</div>
