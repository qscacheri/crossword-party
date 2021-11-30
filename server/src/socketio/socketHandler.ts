import { Server, Socket } from 'socket.io';
import { sessionManager } from '../SessionManager';
import { MessageType } from '../types';
import { onCreateRoom } from './onCreateRoom';
import { onJoinRoom } from './onJoinRoom';
import { onUpdate } from './onUpdate';

export const socketHandler = (io: Server, socket: Socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
    sessionManager.removeMember(socket.id);
  });
  socket.on(MessageType.CREATE_ROOM, () => onCreateRoom(io, socket, null));
  socket.on(MessageType.JOIN_ROOM, (data) => onJoinRoom(io, socket, data));
  socket.on(MessageType.UPDATE, (data) => onUpdate(io, socket, data));
};
