import { sessionManager } from '../SessionManager';
// import { v4 as uuid } from 'uuid';
import { MessageType, SocketIOHandler } from '../types';
export const onCreateRoom: SocketIOHandler = async (_, socket) => {
  const roomId = 'test';
  console.log(`[${roomId}] Creating room`);

  const updated = sessionManager.createSession(roomId, socket.id);
  await socket.join(roomId);
  socket.emit(MessageType.ROOM_CREATED, {
    roomId,
    members: updated.members,
    cells: updated.cells,
  });
};
