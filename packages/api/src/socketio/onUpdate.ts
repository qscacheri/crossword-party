import { z } from 'zod';
import { sessionManager } from '../SessionManager';
import { Guess, MessageType, SocketIOHandler } from '../types';
import { guessSchema } from './socketHandler';

const updatePayloadSchema = z.object({
  roomId: z.string(),
  guesses: z.map(z.string(), guessSchema),
  cursor: z.number(),
});

type UpdatePayload = z.infer<typeof updatePayloadSchema>;

export const onUpdate: SocketIOHandler = async (
  io,
  socket,
  data: UpdatePayload
) => {
  const { roomId, guesses, cursor } = data;
  console.log('Received update:', data);
  const updated = sessionManager.updateSessionData(
    roomId,
    guesses,
    socket.id,
    data.cursor
  );
  console.log('Room updated:', updated);
  socket.emit(MessageType.ROOM_UPDATED);
  io.to(roomId).emit(MessageType.UPDATE, {
    guesses: Object.fromEntries(updated.guesses),
    members: updated.members,
  });
};
