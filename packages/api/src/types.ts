import { Server, Socket } from 'socket.io';

export type Cell = {
  type: number;
  value: string;
  index: number;
};

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
  cells: Cell[];
};

export enum MessageType {
  UPDATE = 'UPDATE',
  JOIN_ROOM = 'JOIN_ROOM',
  ROOM_JOINED = 'ROOM_JOINED',
  CREATE_ROOM = 'CREATE_ROOM',
  ROOM_CREATED = 'ROOM_CREATED',
}
