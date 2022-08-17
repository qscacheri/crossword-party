import { sessionManager } from '../SessionManager';
import { MessageType, SocketIOHandler } from '../types';

type OnJoinPayload = {
  roomId: string;
};
export const onJoinRoom: SocketIOHandler = (_, socket, data: OnJoinPayload) => {
  console.log('Joining room: ', data.roomId);
  socket.join(data.roomId);
  const updated = sessionManager.addMember(data.roomId, socket.id);
  socket.emit(MessageType.ROOM_JOINED, {
    roomId: data.roomId,
    cells: updated.cells,
    members: updated.members,
  });
};
