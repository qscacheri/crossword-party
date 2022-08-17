<script lang="ts">
	import { pstore, PuzzleStore } from '../stores/PuzzleStore';
	import type { CellType } from '../types/types';

	export let selected: boolean;
	export let highlighted: boolean;
	export let cell: CellType;
	export let cellIndex: number;
	export let value: string;
	export let showAsWrong: boolean;
	export let showAsCorrect: boolean;

	let blockBorders = {
		top: false,
		bottom: false,
		left: false,
		right: false
	};
	$: {
		if ($pstore.puzzle) {
			const cellAbove = $pstore.puzzle.body.cells[cellIndex - $pstore.puzzle.body.dimensions.width];
			if (cellAbove && PuzzleStore.isBlock(cellAbove)) {
				blockBorders.top = true;
			}

			const cellBelow = $pstore.puzzle.body.cells[cellIndex + $pstore.puzzle.body.dimensions.width];
			if (cellBelow && PuzzleStore.isBlock(cellBelow)) {
				blockBorders.bottom = true;
			}

			const cellLeft = $pstore.puzzle.body.cells[cellIndex - 1];
			if (cellLeft && PuzzleStore.isBlock(cellLeft)) {
				blockBorders.left = true;
			}
			const cellRight = $pstore.puzzle.body.cells[cellIndex + 1];
			if (cellRight && PuzzleStore.isBlock(cellRight)) {
				blockBorders.right = true;
			}
		}
	}
	$: member = $pstore.members.find(({ cursorIndex }) => cursorIndex === cellIndex);
</script>

<div
	on:keydown
	class="cell bg-white w-full h-full border-black border-[.25px] relative grid place-items-center"
	class:block={PuzzleStore.isBlock(cell)}
	class:selected
	class:showAsCorrect
	class:highlighted
	class:member-cursor={!!member}
	style={`
        --block-border-top: ${blockBorders.top ? '.5px solid grey' : 'none'};
        --block-border-bottom: ${blockBorders.bottom ? '.5px solid grey' : 'none'}; 
        --block-border-left: ${blockBorders.left ? '.5px solid grey' : 'none'}; 
        --block-border-right: ${blockBorders.right ? '.5px solid grey' : 'none'};
        --member-color: ${member?.color || 'red'};
    `}
	on:click
>
	{#if cell}
		{#if cell.label}
			<p class="label">{cell.label}</p>
		{/if}
		<p class="uppercase text-3xl" class:showAsCorrect>{value}</p>
	{/if}
	{#if showAsWrong}
		<svg view-box="0 0 1 1" class="w-full h-full top-0 left-0 absolute">
			<line x1="0" y1="0" x2="100" y2="100" stroke="red" />
		</svg>
	{/if}
</div>

<style>
	.grid.showAsCorrect {
		border-color: rgb(109, 109, 214);
	}

	.highlighted {
		background: var(--highlighted);
	}

	.member-cursor {
		background-color: var(--member-color);
	}

	.selected {
		background-color: #ffda00;
	}

	.cell.block {
		background: black;
		border-top: var(--block-border-top);
		border-bottom: var(--block-border-bottom);
		border-left: var(--block-border-left);
		border-right: var(--block-border-right);
	}

	.label {
		position: absolute;
		font-size: 0.5rem;
		padding: 0;
		margin: 0;
		top: 0;
		left: 1px;
	}

	.showAsCorrect {
		color: rgb(109, 109, 214);
	}
</style>
