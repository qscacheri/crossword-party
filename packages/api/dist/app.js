"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketHandler_1 = require("./socketio/socketHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: '*' }));
    const server = http_1.default.createServer(app);
    app.get('/healthz', (_, res) => {
        res.send('ok');
    });
    const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
    io.on('connection', (socket) => (0, socketHandler_1.socketHandler)(io, socket));
    return server;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map