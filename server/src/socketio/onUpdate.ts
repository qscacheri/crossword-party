import { printCells, sessionManager } from '../SessionManager';
import { Cell, MessageType, SocketIOHandler } from '../types';

type UpdatePayload = {
  roomId: string;
  cells: Cell[];
  cursorIndex: number;
};
export const onUpdate: SocketIOHandler = async (
  io,
  socket,
  data: UpdatePayload
) => {
  const { roomId, cells } = data;
  printCells(cells);

  const updated = sessionManager.updateSessionData(
    roomId,
    cells,
    socket.id,
    data.cursorIndex
  );
  io.to(roomId).emit(MessageType.UPDATE, {
    cells: updated.cells,
    members: updated.members,
  });
};
