<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { pstore } from '../stores/PuzzleStore';
	import type { ClueType } from '../types/types';
	import Chevron from './Chevron.svelte';

	const keys = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm']
	];
	export let clue: ClueType;
	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col bg-[#E6E6E6] flex-grow sm:hidden">
	<div class="h-12 bg-[#A7D8FF] flex justify-between">
		<Chevron class="" on:click={() => {}} />
		<p class="my-auto">{clue.text?.[0].plain}</p>
		<Chevron class="rotate-180" />
	</div>
	{#each keys as row}
		<div class="flex w-full justify-center ">
			{#each row as key}
				<button
					on:click={() => {
						dispatch('keyPressed', { key });
					}}
					class="p-2 bg-neutral-100 rounded w-7 flex-shrink-0 flex capitalize justify-around m-1"
				>
					{key}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
</style>
