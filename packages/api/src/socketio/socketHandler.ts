import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { sessionManager } from '../SessionManager';
import { MessageType } from '../types';
import { onCreateRoom } from './onCreateRoom';
import { onJoinRoom } from './onJoinRoom';
import { onUpdate } from './onUpdate';

export const guessSchema = z.object({
  cell: z.number(),
  value: z.string(),
  isPencil: z.boolean(),
  markAsCorrect: z.boolean(),
  markAsWrong: z.boolean(),
});

export const socketHandler = (io: Server, socket: Socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
    sessionManager.removeMember(socket.id);
  });
  socket.on(MessageType.CREATE_ROOM, (data) => onCreateRoom(io, socket, data));
  socket.on(MessageType.JOIN_ROOM, (data) => onJoinRoom(io, socket, data));
  socket.on(MessageType.UPDATE, (data) => onUpdate(io, socket, data));
};
