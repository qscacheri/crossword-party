"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateRoom = void 0;
const SessionManager_1 = require("../SessionManager");
const types_1 = require("../types");
const onCreateRoom = async (_, socket) => {
    const roomId = 'test';
    console.log(`[${roomId}] Creating room`);
    const updated = SessionManager_1.sessionManager.createSession(roomId, socket.id);
    await socket.join(roomId);
    socket.emit(types_1.MessageType.ROOM_CREATED, {
        roomId,
        members: updated.members,
        cells: updated.cells,
    });
};
exports.onCreateRoom = onCreateRoom;
//# sourceMappingURL=onCreateRoom.js.map