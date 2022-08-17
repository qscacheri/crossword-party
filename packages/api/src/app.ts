import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { socketHandler } from './socketio/socketHandler';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: '*' }));
  const server = http.createServer(app);

  app.get('/healthz', (_, res) => {
    res.send('ok');
  });

  const io = new SocketServer(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => socketHandler(io, socket));

  return server;
};
