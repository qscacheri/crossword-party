<script lang="ts">
	import Cell from '../components/Cell.svelte';
	import { pstore } from '../stores/PuzzleStore';
	import type { CellType, Dimensions } from '../types/types';
	export let cells: (CellType | null)[];
	export let dimensions: Dimensions;
	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowUp':
				return pstore.moveUp();
			case 'ArrowDown':
				return pstore.moveDown();
			case 'ArrowLeft':
				return pstore.moveLeft();
			case 'ArrowRight':
				return pstore.moveRight();
			case 'Backspace':
				return pstore.removeGuess();
			default:
				if (e.key.length > 1) {
					return;
				}
				return /[a-zA-Z0-9\*\.]/.test(e.key) && !e.metaKey && pstore.guess(e.key, false);
		}
	};

	function getShowAsCorrect(cell: CellType | null, i: number): boolean {
		const guess = $pstore.guesses.get(i);
		if (!guess || !$pstore.autoCheckOn) return false;
		return cell?.answer?.toLocaleLowerCase() === guess.value.toLocaleLowerCase();
	}

	$: getIsHighlighted = (cellIndex: number) => {
		const selectedClueIndex = $pstore.selectedClueIndex;
		return $pstore.puzzle!.body.clues[selectedClueIndex].cells!.includes(cellIndex);
	};

	$: showAsWrong = (cell: CellType, cellIndex: number) => {
		if (!$pstore.autoCheckOn) return false;
		if (!cell?.answer) return false;
		const guess = $pstore.guesses.get(cellIndex)?.value;
		if (!guess) return false;
		return cell.answer.toLocaleLowerCase() !== guess.toLocaleLowerCase();
	};
</script>

<!-- <svelte:window on:keydown={handleKeyDown} /> -->
<div class="sm:col-span-4 grid place-items-center" on:keydown={handleKeyDown} tabindex={0}>
	<div
		class={`grid aspect-square flex-shrink h-full border-2 border-black `}
		style="--grid-width: {dimensions.width}; --grid-height: {dimensions.height}"
	>
		{#each cells as cell, i}
			{#if cell}
				<Cell
					{cell}
					cellIndex={i}
					highlighted={getIsHighlighted(i)}
					selected={$pstore.selectedCellIndex === i}
					value={$pstore.guesses.get(i)?.value || ''}
					on:click={() => pstore.setSelectedCell(i)}
					showAsWrong={showAsWrong(cell, i)}
					showAsCorrect={getShowAsCorrect(cell, i)}
				/>
			{/if}
		{/each}
	</div>
</div>

<style>
	.grid {
		grid-template-columns: repeat(var(--grid-width), minmax(0, 1fr));
		grid-template-rows: repeat(var(--grid-height), minmax(0, 1fr));
	}
</style>
