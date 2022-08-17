<script lang="ts">
	import type { ClueType } from '../types/types';

	export let clue: ClueType;
	export let selected: boolean;
	let el: HTMLDivElement | null = null;
	$: {
		console.log('Selected');
		if (selected) el?.scrollIntoView();
	}
</script>

<div
	bind:this={el}
	class="flex cursor-pointer hover:bg-slate-300"
	class:selected
	class:completed={clue.completed}
	on:click
>
	<p class="mr-2">{clue.label}.</p>
	<p>{clue.text?.[0].plain}</p>
</div>

<style lang="postcss">
	.completed {
		@apply text-gray-300;
	}
	.selected {
		background: var(--highlighted);
	}
</style>
