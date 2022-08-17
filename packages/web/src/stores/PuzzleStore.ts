import type { LoadEvent } from '@sveltejs/kit';
import { Map } from 'immutable';
import io, { Socket } from 'socket.io-client';
import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type {
	CellType,
	ClueType,
	GetPuzzleResponse,
	Guess,
	Member,
	PuzzleData
} from '../types/types';
import { ClueDirections } from '../types/types';

interface PuzzleStoreType {
	puzzle: PuzzleData | null;
	selectedCellIndex: number | null;
	currentDirection: ClueDirections;
	guesses: Map<number, Guess>;
	selectedClueIndex: number;
	autoCheckOn: boolean;
	isPencil: boolean;
	roomId: string | null;
	members: Member[];
}

type Fetch = LoadEvent['fetch'];

const cookie =
	'NYT-S=2ofjYG69.w.M.edMd2rU.K80H129675nG8BNpS2oe1tpoqo.ZXO.IffzC7FBWyRnjmjOoea6bgYnQjiv2H7XNkjQBUqbhk3APf/.8ZXwJaaX0bNLyX.IZl4gvE3rxuJaFj2UMtMHxXQRYUpZZcwOatwuI0.ZE0cTbj7NbqiklW3ft99447CwufkgfedLyQReJ6CLgKYkTd9T00';

declare type Invalidator<T> = (value?: T) => void;
export class PuzzleStore {
	socket: Socket;
	subscribe: (
		this: void,
		run: Subscriber<PuzzleStoreType>,
		invalidate?: Invalidator<PuzzleStoreType>
	) => Unsubscriber;
	store: Writable<PuzzleStoreType>;

	constructor() {
		const endpoint = 'http://localhost:3002';
		this.socket = io(endpoint, {
			reconnectionDelayMax: 10000,
			autoConnect: true
		});
		this.socket.on('connect', () => {
			console.log('connected');
		});

		this.socket.on('ROOM_CREATED', this.roomJoined.bind(this));
		this.socket.on('ROOM_JOINED', this.roomJoined.bind(this));
		this.socket.on('UPDATE', this.onUpdate.bind(this));

		const store = writable<PuzzleStoreType>({
			puzzle: null,
			selectedCellIndex: 0,
			currentDirection: ClueDirections.Across,
			guesses: Map(),
			selectedClueIndex: 0,
			autoCheckOn: true,
			isPencil: false,
			members: [],
			roomId: null
		});
		this.store = store;
		this.subscribe = store.subscribe;
	}

	static isBlock = (cell: CellType) => {
		return !cell.type;
	};

	createRoom() {
		this.socket.emit('CREATE_ROOM', { guesses: get(this.store).guesses });
	}

	joinRoom(roomId: string) {
		this.socket.emit('JOIN_ROOM', { roomId });
	}

	roomJoined(data: { roomId: string }) {
		console.log('room joined', data);
		this.store.update((store) => ({ ...store, roomId: data.roomId }));
	}

	getPuzzle = async (date: Date, fetch: Fetch) => {
		const puzzleId = await this.getPuzzleId(date, fetch);

		const res = await fetch(
			`https://nyt-games-prd.appspot.com/svc/crosswords/v6/puzzle/${puzzleId}.json`,
			{
				headers: {
					cookie: cookie
				}
			}
		);
		const data = (await res.json()) as GetPuzzleResponse;
		const { body } = data;
		if (!body) throw new Error('No data');
		this.store.update((store) => ({ ...store, puzzle: { ...data, body: body[0] } }));
	};

	setSelectedCell(cellIndex: number) {
		const store = get(this.store);
		if (cellIndex === store.selectedCellIndex) {
			this.toggleDirection();
		} else {
			this.store.update((store) => ({ ...store, selectedCellIndex: cellIndex }));
		}
		this.updateSelectedClue();
		this.updateCollab();
	}

	toggleDirection() {
		this.store.update((store) => {
			return {
				...store,
				currentDirection:
					store.currentDirection === ClueDirections.Across
						? ClueDirections.Down
						: ClueDirections.Across
			};
		});
		this.updateSelectedClue();
		this.updateCollab();
	}

	moveUp() {
		const store = get(this.store);
		if (store.currentDirection === ClueDirections.Across) {
			return this.toggleDirection();
		}
		this.store.update((store) => {
			const { puzzle } = store;
			let newSelectedCell = store.selectedCellIndex;
			if (!puzzle || nullAndNotZero(newSelectedCell)) return store;

			const { width } = puzzle.body.dimensions;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const potentialNextCell = puzzle.body.cells[newSelectedCell - width];

				if (newSelectedCell - width < 0) {
					return store;
				} else if (PuzzleStore.isBlock(potentialNextCell)) {
					// if the next cell is a block, we move keep moving until we reach a non-block cell or the end of the row

					newSelectedCell -= width;
				} else {
					return { ...store, selectedCellIndex: newSelectedCell - width };
				}
			}
		});
		this.updateSelectedClue();
		this.updateCollab();
	}

	moveDown() {
		const store = get(this.store);
		if (store.currentDirection === ClueDirections.Across) {
			return this.toggleDirection();
		}
		this.store.update((store) => {
			const { puzzle } = store;
			let newSelectedCell = store.selectedCellIndex;
			if (!puzzle || nullAndNotZero(newSelectedCell)) return store;

			const { width } = puzzle.body.dimensions;

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const potentialNextCell = puzzle.body.cells[newSelectedCell + width];

				if (newSelectedCell + width > puzzle.body.cells.length) {
					return store;
				} else if (PuzzleStore.isBlock(potentialNextCell)) {
					// if the next cell is a block, we move keep moving until we reach a non-block cell or the end of the row
					newSelectedCell += width;
				} else {
					return { ...store, selectedCellIndex: newSelectedCell + width };
				}
			}
		});
		this.updateSelectedClue();
		this.updateCollab();
	}

	moveLeft() {
		const store = get(this.store);
		if (store.currentDirection === ClueDirections.Down) {
			return this.toggleDirection();
		}
		this.store.update((store) => {
			const { puzzle } = store;
			let newSelectedCell = store.selectedCellIndex;
			if (!puzzle || nullAndNotZero(newSelectedCell)) return store;

			const { width } = puzzle.body.dimensions;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const potentialNextCell = puzzle.body.cells[newSelectedCell - 1];

				if ((newSelectedCell % width) - 1 < 0) {
					return store;
				} else if (PuzzleStore.isBlock(potentialNextCell)) {
					// if the next cell is a block, we move keep moving until we reach a non-block cell or the end of the row

					newSelectedCell--;
				} else {
					return { ...store, selectedCellIndex: newSelectedCell - 1 };
				}
			}
		});
		this.updateSelectedClue();
		this.updateCollab();
	}

	moveRight() {
		const store = get(this.store);
		if (store.currentDirection === ClueDirections.Down) {
			return this.toggleDirection();
		}
		this.store.update((store) => {
			const { puzzle } = store;
			let newSelectedCell = store.selectedCellIndex;
			if (!puzzle || nullAndNotZero(newSelectedCell)) return store;

			const { width } = puzzle.body.dimensions;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const potentialNextCell = puzzle.body.cells[newSelectedCell + 1];

				if ((newSelectedCell % width) + 1 >= width) {
					return store;
				} else if (PuzzleStore.isBlock(potentialNextCell)) {
					// if the next cell is a block, we move keep moving until we reach a non-block cell or the end of the row

					newSelectedCell++;
				} else {
					return { ...store, selectedCellIndex: newSelectedCell + 1 };
				}
			}
		});
		this.updateSelectedClue();
		this.updateCollab();
	}

	// updates the selected clue based on the selected cell and the current direction
	updateSelectedClue() {
		const store = get(this.store);
		const { puzzle, selectedCellIndex } = store;

		if (!puzzle || nullAndNotZero(selectedCellIndex)) return;

		const selectedCell = puzzle.body.cells[selectedCellIndex];
		const direction = store.currentDirection;
		const clueIndex =
			direction === ClueDirections.Across ? selectedCell.clues?.[0] : selectedCell.clues?.[1];
		const selectedClue = store.puzzle?.body.clues[store.selectedClueIndex];
		// every cell for a clue has been guessed, mark as done
		if (!selectedClue?.cells) return store;
		const clueComplete = selectedClue?.cells.every((cell) => {
			console.log({ guess: this.getGuess(cell), complete: !!this.getGuess(cell) });
			return !!this.getGuess(cell);
		});
		console.log({ selectedClue, clueComplete });
		const updatedClues: ClueType[] = (store.puzzle?.body.clues || []).map((clue, i) => {
			if (i === store.selectedClueIndex) {
				return {
					...clue,
					completed: clueComplete
				};
			}
			return clue;
		});
		return this.store.update((store) => ({
			...store,
			puzzle: {
				...puzzle,
				body: {
					...puzzle.body,
					clues: updatedClues
				}
			},
			selectedClueIndex: clueIndex || 0
		}));
	}

	setSelectedClue(clueIndex: number) {
		this.store.update((store) => {
			return {
				...store,
				selectedClueIndex: clueIndex,
				selectedCellIndex: store.puzzle?.body.clues[clueIndex].cells?.[0] || 0,
				currentDirection:
					(store.puzzle?.body.clues[clueIndex].direction as ClueDirections) || ClueDirections.Across
			};
		});
	}

	isGuessCorrect = (cell: number, guess: string) => {
		const store = get(this.store);
		const { puzzle } = store;
		if (!puzzle) return false;

		const answer = puzzle?.body.cells?.[cell].answer || '';
		return answer.toLowerCase() === guess.toLowerCase();
	};

	getCell(index: number) {
		const store = get(this.store);
		const { puzzle } = store;
		if (!puzzle) return null;

		return puzzle.body.cells[index];
	}

	getGuess(index: number) {
		const store = get(this.store);
		const { puzzle } = store;
		if (!puzzle) return null;

		return store.guesses.get(index);
	}

	guess(value: string, isPencil: boolean) {
		this.store.update((store) => {
			const { selectedCellIndex, puzzle } = store;
			if (!puzzle || nullAndNotZero(selectedCellIndex)) return store;

			return {
				...store,
				guesses: store.guesses.set(selectedCellIndex, {
					value,
					cell: selectedCellIndex,
					markAsCorrect: false,
					markAsWrong: false,
					isPencil
				})
			};
		});
		const { currentDirection } = get(this.store);
		if (currentDirection === ClueDirections.Across) {
			this.moveRight();
		} else {
			this.moveDown();
		}
		this.updateSelectedClue();
		console.log(get(this.store).guesses);
		this.updateCollab();
	}

	updateCollab() {
		const store = get(this.store);
		if (!store.roomId) return;
		this.socket.emit('UPDATE', {
			roomId: store.roomId,
			guesses: store.guesses,
			cursor: store.selectedCellIndex || 0
		});
	}

	onUpdate(data: any) {
		console.log(data.members);
		let guessesMap = Map<number, Guess>();
		Object.entries(data.guesses).forEach(([key, value]) => {
			guessesMap = guessesMap.set(parseInt(key), value as Guess);
		});
		console.log(guessesMap);
		console.log('Received update', data);
		console.log(data);
		this.store.update((store) => ({ ...store, guesses: guessesMap, members: data.members }));
	}

	removeGuess() {
		const store = get(this.store);
		const { selectedCellIndex } = store;
		if (nullAndNotZero(selectedCellIndex)) return;

		if (
			store.autoCheckOn &&
			this.isGuessCorrect(selectedCellIndex, store.guesses.get(selectedCellIndex)?.value || '')
		) {
			//  do nothing
		} else {
			this.store.update((store) => {
				return {
					...store,
					guesses: store.guesses.delete(selectedCellIndex)
				};
			});
		}
		const { currentDirection } = get(this.store);
		if (currentDirection === ClueDirections.Across) {
			this.moveLeft();
		} else {
			this.moveUp();
		}
		this.updateSelectedClue();
		this.updateCollab();
	}

	toggleAutoCheck() {
		this.store.update((store) => {
			return { ...store, autoCheckOn: !store.autoCheckOn };
		});
	}

	async getPuzzleId(date: Date, fetch: Fetch): Promise<number> {
		const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			'0'
		)}-${date.getDate()}`;
		const url = `https://nyt-games-prd.appspot.com/svc/crosswords/v2/puzzle/daily-${formatted}.json`;

		const res = await fetch(url, {
			headers: {
				cookie: cookie
			}
		});
		const data = await res.json();
		return data.results[0].puzzle_id;
	}
}

function nullAndNotZero(val: number | null): val is null {
	if (!val && val !== 0) {
		return true;
	}
	return false;
}

export const pstore = new PuzzleStore();

pstore.subscribe(({ puzzle, guesses }) => {
	if (!puzzle) return;
	localStorage.setItem(`puzzle-${puzzle.publicationDate}`, JSON.stringify(guesses));
});
