import { Socket } from 'socket.io';
import { onUpdate } from './onUpdate';

export const socketHandler = (socket: Socket) => {
  const { room } = socket.handshake.query;
  socket.on('disconnect', () => {
    socket.join(room as string);
  });

  socket.on('update', onUpdate);
};
