<script>
	import { pstore } from '../stores/PuzzleStore';
	let joinRoomText = '';
	let cheatMenuVisible = false;
	let showMoreCheats = false;

	$: autoCheckOn = $pstore.autoCheckOn;
</script>

<div class="relative flex items-center mr-4">
	<button on:click={() => (cheatMenuVisible = !cheatMenuVisible)}>Check</button>
	{#if cheatMenuVisible}
		<div
			class="flex flex-col items-center w-56 h-42 right-0 top-full justify-center absolute bg-white shadow-md p-8 "
		>
			<button
				class:auto-check-on={autoCheckOn}
				class={'w-full btn-primary'}
				on:click={() => pstore.toggleAutoCheck()}>Autocheck</button
			>
		</div>
	{/if}
</div>

<style>
	.auto-check-on {
		background-color: var(--highlighted);
	}
</style>
