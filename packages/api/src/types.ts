import { Server, Socket } from 'socket.io';

export interface CellType {
  answer?: string | null;
  clues?: number[] | null;
  label?: string | null;
  type?: number | null;
}

export type Member = {
  id: string;
  color: string;
  cursorIndex: number;
};

export type SocketIOHandler = (
  io: Server,
  socket: Socket,
  data: any
) => Promise<void> | void;

export type Session = {
  members: Member[];
  id: string;
  guesses: Map<number, Guess>;
};

export enum MessageType {
  UPDATE = 'UPDATE',
  ROOM_UPDATED = 'ROOM_UPDATED',
  JOIN_ROOM = 'JOIN_ROOM',
  ROOM_JOINED = 'ROOM_JOINED',
  CREATE_ROOM = 'CREATE_ROOM',
  ROOM_CREATED = 'ROOM_CREATED',
}

export type Guess = {
  cell: number;
  value: string;
  isPencil: boolean;
  markAsCorrect: boolean;
  markAsWrong: boolean;
};
