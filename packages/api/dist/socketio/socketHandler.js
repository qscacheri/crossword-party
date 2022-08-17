"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const SessionManager_1 = require("../SessionManager");
const types_1 = require("../types");
const onCreateRoom_1 = require("./onCreateRoom");
const onJoinRoom_1 = require("./onJoinRoom");
const onUpdate_1 = require("./onUpdate");
const socketHandler = (io, socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
        SessionManager_1.sessionManager.removeMember(socket.id);
    });
    socket.on(types_1.MessageType.CREATE_ROOM, () => (0, onCreateRoom_1.onCreateRoom)(io, socket, null));
    socket.on(types_1.MessageType.JOIN_ROOM, (data) => (0, onJoinRoom_1.onJoinRoom)(io, socket, data));
    socket.on(types_1.MessageType.UPDATE, (data) => (0, onUpdate_1.onUpdate)(io, socket, data));
};
exports.socketHandler = socketHandler;
//# sourceMappingURL=socketHandler.js.map