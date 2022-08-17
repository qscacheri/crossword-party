export enum ClueDirections {
	Across = 'Across',
	Down = 'Down'
}

export enum CellState {
	Empty = 'empty',
	Selected = 'selected',
	Highlighted = 'highlighted'
}

export interface TextEntity {
	plain: string;
}

export interface GetPuzzleResponse {
	body?: GetPuzzleResponseBody[] | null;
	constructors?: string[] | null;
	copyright: string;
	editor: string;
	id: number;
	lastUpdated: string;
	publicationDate: string;
	relatedContent: RelatedContent;
}
export interface GetPuzzleResponseBody {
	board: string;
	cells: CellType[];
	clueLists?: ClueLists[] | null;
	clues: ClueType[];
	dimensions: Dimensions;
}
export interface CellType {
	answer?: string | null;
	clues?: number[] | null;
	label?: string | null;
	type?: number | null;
}
export interface ClueLists {
	clues?: number[] | null;
	name: string;
}
export interface ClueType {
	completed: boolean;
	cells: number[] | null;
	direction: string;
	label: string;
	text?: TextEntity[] | null;
	list?: number | null;
}
export interface TextEntity {
	formatted?: string | null;
	plain: string;
}
export interface Dimensions {
	height: number;
	width: number;
}
export interface RelatedContent {
	text: string;
	url: string;
}

export type PuzzleData = Pick<
	GetPuzzleResponse,
	| 'constructors'
	| 'copyright'
	| 'editor'
	| 'id'
	| 'lastUpdated'
	| 'publicationDate'
	| 'relatedContent'
> & {
	body: GetPuzzleResponseBody;
};

export type Guess = {
	cell: number;
	value: string;
	isPencil: boolean;
	markAsCorrect: boolean;
	markAsWrong: boolean;
};

export type MoveDirection = 'up' | 'down' | 'left' | 'right';

export type Member = {
	id: string;
	color: string;
	cursorIndex: number;
};
