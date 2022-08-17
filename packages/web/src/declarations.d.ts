import type { PuzzleStore } from './stores/PuzzleStore';

declare global {
	interface Window {
		puzzle: PuzzleStore;
	}
}
