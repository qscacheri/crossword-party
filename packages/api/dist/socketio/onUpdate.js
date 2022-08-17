"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUpdate = void 0;
const SessionManager_1 = require("../SessionManager");
const types_1 = require("../types");
const onUpdate = async (io, socket, data) => {
    const { roomId, cells } = data;
    (0, SessionManager_1.printCells)(cells);
    const updated = SessionManager_1.sessionManager.updateSessionData(roomId, cells, socket.id, data.cursorIndex);
    io.to(roomId).emit(types_1.MessageType.UPDATE, {
        cells: updated.cells,
        members: updated.members,
    });
};
exports.onUpdate = onUpdate;
//# sourceMappingURL=onUpdate.js.map