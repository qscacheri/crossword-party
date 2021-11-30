import React, { useCallback, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [roomId, setRoomId] = useState('test');
  const createRoom = async () => {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(
      tab.id!,
      { type: 'CREATE_ROOM' },
      function (response) {
        console.log(response);
      }
    );
  };
  const joinRoom = useCallback(async () => {
    console.log({ roomId });

    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(
      tab.id!,
      { type: 'JOIN_ROOM', roomId },
      function (response) {
        console.log(response);
      }
    );
  }, [roomId]);

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <div>
        <input
          placeholder="Room Id"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export default Popup;
