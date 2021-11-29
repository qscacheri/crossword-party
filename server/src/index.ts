import { createApp } from './app';

export const main = () => {
  const server = createApp();
  server.listen(3000, () => {
    console.log('listening on *:3000');
  });
};
