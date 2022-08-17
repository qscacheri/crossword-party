import { sessionManager } from '../SessionManager';
import { MessageType, SocketIOHandler } from '../types';
import { z } from 'zod';

const onJoinRoomPayloadSchema = z.object({
  roomId: z.string(),
});

type OnJoinPayload = z.infer<typeof onJoinRoomPayloadSchema>;

export const onJoinRoom: SocketIOHandler = (_, socket, req: unknown) => {
  const valid = onJoinRoomPayloadSchema.safeParse(req);
  if (!valid.success) {
    console.log('Invalid join room payload', req);
    return;
  }
  const { roomId } = valid.data;
  socket.join(roomId);
  const updated = sessionManager.addMember(roomId, socket.id);
  socket.emit(MessageType.ROOM_JOINED, {
    roomId,
    guesses: Object.fromEntries(updated.guesses),
    members: updated.members,
  });
};
