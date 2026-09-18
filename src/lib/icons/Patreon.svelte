<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	interface Props extends SVGAttributes<SVGSVGElement> {
		size?: number | string;
	}

	let { size = 24, ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 80 80"
	width={size}
	height={size}
	fill="currentColor"
	aria-hidden="true"
	{...rest}
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M40 75C59.33 75 75 59.33 75 40C75 20.67 59.33 5 40 5C20.67 5 5 20.67 5 40C5 59.33 20.67 75 40 75ZM25 60H32.5V25H25V60ZM60 37.518C60 30.615 54.401 25 47.519 25C40.616 25 35 30.615 35 37.518C35 44.400 40.616 50 47.519 50C54.401 50 60 44.400 60 37.518Z"
	/>
</svg>
