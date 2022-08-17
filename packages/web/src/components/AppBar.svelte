<script lang="ts">
	import { pstore } from '../stores/PuzzleStore';
	import CheckButton from './CheckButton.svelte';
	import CollabMode from './CollabMode.svelte';
</script>

<div class="h-full flex relative white border-b border-black">
	<div class="flex-grow" />
	<button class="menu-button">Rebus</button>
	<button class="menu-button">Clear</button>
	<button class="menu-button">Reveal</button>
	<CheckButton />
	<CollabMode />
	<!-- {#if cheatMenuVisible}
		<div class="fixed w-screen h-screen z-40" on:click={() => (cheatMenuVisible = false)} />
		<div class="absolute w-32 bg-[#5085E5] top-full left-full -translate-x-full z-50">
			{#if !showMoreCheats}
				<button on:click={() => pstore.toggleAutoCheck()} class="cheat-menu-button"
					>Auto Check</button
				>
				<button disabled={$pstore.autoCheckOn} class="cheat-menu-button">Check Square</button>
				<button class="cheat-menu-button">Check Puzzle</button>
				<button on:click={() => (showMoreCheats = !showMoreCheats)} class="cheat-menu-button"
					>More</button
				>
			{:else}
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
				<button class="cheat-menu-button">Auto Check</button>
			{/if}
		</div>
	{/if}
	<img class="mx-4" src="/gear_icon.svg" alt="" /> -->
</div>

<style lang="postcss">
	.menu-button {
		@apply mx-2;
	}
	.cheat-menu-button {
		@apply border-white border-[0.5px] w-full h-12 text-white;
	}
</style>
