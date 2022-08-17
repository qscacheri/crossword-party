<script>
	import { pstore } from '../stores/PuzzleStore';
	let joinRoomText = '';
	let showControls = false;
</script>

<div class="relative flex items-center mr-4">
	<button on:click={() => (showControls = !showControls)}>Collab</button>
	{#if showControls}
		<div
			class="flex flex-col items-center w-96 h-42 right-0 top-full justify-center absolute bg-white shadow-md p-8 z-50"
		>
			<button on:click={() => pstore.createRoom()} class="btn-primary"> Create Room </button>
			<p>or</p>
			<div class="flex w-full items-center gap-2">
				<div><input class="self-start text-field" type="text" bind:value={joinRoomText} /></div>
				<div>
					<button
						class="btn-primary items-center self-start"
						on:click={() => pstore.joinRoom(joinRoomText)}>Join Room</button
					>
				</div>
			</div>
		</div>
		<div
			class="fixed left-0 top-0 bg-none z-40 w-screen h-screen"
			on:click={() => (showControls = false)}
		/>
	{/if}
</div>
