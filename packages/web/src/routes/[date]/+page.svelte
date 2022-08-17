<script lang="ts">
	import { onMount } from 'svelte';
	import AppBar from '../../components/AppBar.svelte';
	import CluesList from '../../components/CluesList.svelte';
	import Grid from '../../components/Grid.svelte';
	import Keyboard from '../../components/Keyboard.svelte';
	import { pstore } from '../../stores/PuzzleStore';

	onMount(() => {
		window.puzzle = pstore;
	});
</script>

<div class="grid app w-screen h-screen">
	<AppBar />
	<div class="grid grid-cols-6 grid-rows-1 h-full w-full p-8">
		{#if $pstore.puzzle}
			<Grid cells={$pstore.puzzle.body.cells} dimensions={$pstore.puzzle.body.dimensions} />
			<CluesList clueList={$pstore.puzzle.body.clues} />
			<!-- <Keyboard
				on:keyPressed={({ detail }) => pstore.guess(detail.key, $pstore.isPencil)}
				clue={$pstore.puzzle.body.clues[$pstore.selectedClueIndex]}
			/> -->
		{/if}
	</div>
</div>

<style>
	.app {
		grid-template-rows: 4rem minmax(0, 1fr);
	}
</style>
