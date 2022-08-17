"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onJoinRoom = void 0;
const SessionManager_1 = require("../SessionManager");
const types_1 = require("../types");
const zod_1 = require("zod");
const onJoinRoomPayloadSchema = zod_1.z.object({
    roomId: zod_1.z.string(),
});
const onJoinRoom = (_, socket, req) => {
    const valid = onJoinRoomPayloadSchema.safeParse(req);
    if (!valid.success) {
        console.log('Invalid join room payload', req);
        return;
    }
    const { roomId } = valid.data;
    socket.join(roomId);
    const updated = SessionManager_1.sessionManager.addMember(roomId, socket.id);
    socket.emit(types_1.MessageType.ROOM_JOINED, {
        roomId,
        cells: updated.cells,
        members: updated.members,
    });
};
exports.onJoinRoom = onJoinRoom;
//# sourceMappingURL=onJoinRoom.js.map