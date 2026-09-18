<script lang="ts">
	interface Props {
		size?: string;
		label?: string;
	}

	let { size = '8rem', label = 'Loading' }: Props = $props();
</script>

<div class="spinner" role="status">
	<img src="/images/walking.webp" alt="" style:height={size} width="1" height="1" />
	<span class="visually-hidden">{label}</span>
</div>

<style>
	.spinner {
		display: flex;
		justify-content: center;
	}

	img {
		width: auto;
		transform: scaleX(-1);
	}
</style>
