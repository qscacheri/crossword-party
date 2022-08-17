<script lang="ts">
	import { pstore } from '../stores/PuzzleStore';
	import { ClueDirections, type ClueType } from '../types/types';
	import Clue from './Clue.svelte';

	export let clueList: ClueType[];

	$: sortedClues = clueList.reduce<{
		Across: (ClueType & { index: number })[];
		Down: (ClueType & { index: number })[];
	}>(
		(prev, current, i) => {
			if (current.direction === ClueDirections.Across) {
				return { ...prev, Across: [...prev.Across, { ...current, index: i }] };
			} else {
				return { ...prev, Down: [...prev.Down, { ...current, index: i }] };
			}
		},
		{
			Across: [],
			Down: []
		}
	);
</script>

<div class="col-start-5 col-span-2 w-full h-full">
	<div class="grid grid-cols-2 grid-rows-1 h-full overflow-scroll">
		<div class="column">
			{#each sortedClues.Across as clue}
				<Clue
					{clue}
					on:click={() => pstore.setSelectedClue(clue.index)}
					selected={$pstore.selectedClueIndex === clue.index}
				/>
			{/each}
		</div>
		<div class="column">
			{#each sortedClues.Down as clue}
				<Clue
					{clue}
					on:click={() => pstore.setSelectedClue(clue.index)}
					selected={$pstore.selectedClueIndex === clue.index}
				/>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	.column {
		@apply h-full w-full overflow-scroll scroll-smooth;
	}
</style>
