import io, { Socket } from 'socket.io-client';
import { Cell, Member } from '../../../types';

export class GameManager {
  private socket: Socket;
  private roomId?: string;
  private initialized = false;

  constructor() {
    this.update = this.update.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    // this.onRoomJoined = this.onRoomJoined.bind(this);
    // this.onRoomCreated = this.onRoomCreated.bind(this);
    this.initialize = this.initialize.bind(this);
    this.socket = io('ws://localhost:3002', {
      reconnectionDelayMax: 10000,
      autoConnect: true,
      query: {
        room: new Date().getUTCMilliseconds(),
      },
    });
    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('ROOM_CREATED', this.initialize);
    this.socket.on('ROOM_JOINED', this.initialize);
    this.socket.on('UPDATE', this.onUpdate);
  }

  onUpdate(data: { cells: Cell[]; members: Member[] }) {
    console.log('received update');
    console.log({ data });

    // printCells(data.cells);
    writeBoard(data.cells);
    drawCursors(data.members);
  }

  //   onRoomCreated(data: { roomId: string }) {
  //     console.log('created room');
  //     this.roomId = data.roomId;
  //     // artifical delay  to allow the dom to update before sending to the server
  //     document.addEventListener('keydown', () => setTimeout(this.update, 200));
  //     document.addEventListener('mousedown', () => setTimeout(this.update, 300));
  //     this.initialized = true;
  //   }

  initialize(data: { roomId: string; cells: Cell[]; members: Member[] }) {
    console.log('joined room');

    this.roomId = data.roomId;
    writeBoard(data.cells);
    drawCursors(data.members);

    // artifical delay  to allow the dom to update before sending to the server
    document.addEventListener('keydown', () => setTimeout(this.update, 200));
    document.addEventListener('mousedown', () => setTimeout(this.update, 300));
    this.initialized = true;
  }

  update() {
    if (!this.isActive() || !this.initialized) {
      return;
    }
    const cells = readBoard();
    const cursorIndex = getCursorCellIndex();
    console.log({ cursorIndex });

    this.socket.emit('UPDATE', { roomId: this.roomId, cells, cursorIndex });
  }

  createRoom() {
    console.log(this.socket);
    this.socket.emit('CREATE_ROOM');
  }

  joinRoom(roomId: string) {
    this.socket.emit('JOIN_ROOM', { roomId });
  }

  isActive() {
    return !!this.roomId;
  }
}

function readCell(index: number) {
  const id = `cell-id-${index}`;
  const cellGroup = document.getElementById(id)?.parentElement;
  if (!cellGroup) {
    return null;
  }
  if (isBlock(cellGroup)) {
    return {
      type: 1,
      value: '',
      index,
      memberId: '',
    };
  }
  const cellText =
    cellGroup.querySelectorAll('text')[2] ||
    cellGroup.querySelectorAll('text')[0];
  if (!cellText) {
    return null;
  }
  return {
    value: cellText.childNodes[1].textContent,
    index,
    type: 1,
  };
}

function readBoard() {
  const board = getBoard();
  if (!board) return null;
  const cells: any[] = [];
  for (let i = 0; i < board.children.length; i++) {
    const cell = readCell(i);
    if (cell) {
      cells.push(cell);
    }
  }
  return cells;
}

function writeBoard(cells: Cell[]) {
  cells.forEach((cell) => {
    writeCell(cell);
  });
}

function getBoard() {
  return document.querySelector('[data-group=cells]');
}

function getCursorCellIndex() {
  const board = getBoard();
  if (!board) return null;
  const cells = board.querySelectorAll('rect');
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.getAttribute('class')?.includes('Cell-selected')) {
      return i;
    }
  }
  return -1;
}

function writeCell(cell: Cell) {
  if (cell.type === 0) {
    return;
  }
  const id = `cell-id-${cell.index}`;
  const cellGroup = document.getElementById(id)?.parentElement;
  if (!cellGroup) {
    return;
  }
  const cellText =
    cellGroup.querySelectorAll('text')[2] ||
    cellGroup.querySelectorAll('text')[0];
  try {
    cellText.childNodes[1].textContent = cell.value;
  } catch (err) {}
}

function isBlock(cell: Element) {
  const classes = cell.querySelector('rect')?.classList || [];
  for (let i = 0; i < classes.length; i++) {
    if (/block/.test(classes[i])) {
      return true;
    }
  }
  return false;
}

export function printCells(cells: Cell[]) {
  const output: string[][] = [];
  for (let i = 0; i < 15; i++) {
    const column = [];
    for (let j = 0; j < 15; j++) {
      const cell = cells[i * 15 + j];
      if (cell.type === 0) {
        column.push('*');
      } else {
        column.push(cell.value);
      }
    }
    output.push(column);
  }
  console.table(output);
}

function drawCursors(members: Member[]) {
  const board = getBoard();
  if (!board) return null;
  for (let i = 0; i < board.children.length; i++) {
    const cell = board.children[i];
    if (cell) {
      cell.querySelector('rect')?.classList.remove('crossword-party-cursor');
    }
  }
  members.forEach((member) => {
    const cell = document.getElementById(`cell-id-${member.cursorIndex}`);
    if (cell) {
      console.log({ member });

      cell.classList.add('crossword-party-cursor');
      cell.style.setProperty('--cursor-color', member.color);
    }
  });
}
