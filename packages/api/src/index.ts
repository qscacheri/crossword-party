import { createApp } from './app';

export const main = () => {
  const server = createApp();
  //   const port = process.env.PORT || 3000;
  const port = 3002;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();
