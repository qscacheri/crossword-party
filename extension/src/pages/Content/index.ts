import { GameManager } from './modules/GameManager';
import { Messenger } from './modules/Messenger';

// handles the connection to the server
const manager = new GameManager();

// handles communication between content script and the extension
const messenger = new Messenger();

messenger.on('CREATE_ROOM', (_, sendResponse) => {
  manager.createRoom();
  sendResponse({ status: 'done' });
});

messenger.on('JOIN_ROOM', (data, sendResponse) => {
  console.log('attempting to join room with id: ', data.roomId);
  manager.joinRoom(data.roomId);
  sendResponse({ status: 'done' });
});
