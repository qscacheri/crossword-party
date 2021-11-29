import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { sessionManager } from './SessionManager';
import { socketHandler } from './socketio/socketHandler';

export const createApp = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  io.on('connection', socketHandler);
  setInterval(
    () =>
      Object.keys(sessionManager.getSessions()).map((id) => {
        io.to(id).emit('update', sessionManager.getSession(id));
      }),
    1000
  );
  return server;
};
