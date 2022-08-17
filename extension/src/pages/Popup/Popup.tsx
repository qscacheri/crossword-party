import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CopyButton } from './CopyButton/CopyButton';
import './Popup.css';

const Popup = () => {
  const [joinRoomText, setJoinRoomText] = useState('test');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const port = useRef<chrome.runtime.Port | null>(null);

  const messageHandler = useCallback((msg: any) => {}, [port.current]);
  useEffect(() => {
    getCurrentTab().then((tab) => {
      port.current = chrome.tabs.connect(tab.id!, { name: 'crossword' });
      port.current.onMessage.addListener(messageHandler);
    });
    return () => {
      port.current?.onMessage.removeListener(messageHandler);
    };
  }, [messageHandler]);
  //   useEffect(
  //     function handle() {
  //       chrome.runtime.onConnect.addListener((port) => {
  //         chrome.runtime.onMessage.addListener((msg) => {
  //           switch (msg.type) {
  //             case 'ROOM_CREATED':
  //               setRoomId(msg.data.roomId);
  //               return;
  //             default:
  //               break;
  //           }
  //         });
  //         return () => {
  //           chrome.runtime.onMessage.removeListener(() => {
  //             console.log('removed');
  //           });
  //         };
  //       });
  //     },
  //     [setRoomId]
  //   );

  useEffect(() => {
    getCurrentTab().then((tab) => {
      chrome.tabs.sendMessage(
        tab.id!,
        { type: 'GET_ROOM_ID' },
        function (response) {
          if (response?.roomId) setRoomId(response.roomId);
          setLoading(false);
        }
      );
    });
  }, [setRoomId]);

  const createRoom = async () => {
    port.current?.postMessage('hi tehre');
    // const tab = await getCurrentTab();
    // chrome.tabs.sendMessage(
    //   tab.id!,
    //   { type: 'CREATE_ROOM' },
    //   function (response) {
    //     console.log({ 'received response': response });
    //     console.log(response);
    //   }
    // );
  };
  const joinRoom = useCallback(async () => {
    console.log({ roomId: joinRoomText });

    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(
      tab.id!,
      { type: 'JOIN_ROOM', roomId: joinRoomText },
      function (response) {
        console.log(response);
      }
    );
  }, [joinRoomText]);

  console.log({ roomId });

  if (loading) return null;

  return (
    <div className="container">
      {roomId === '' ? (
        <>
          <button className="button" onClick={createRoom}>
            Create Room
          </button>
          <p className="or">- or -</p>
          <div className="row">
            <input
              placeholder="Room Id"
              type="text"
              value={joinRoomText}
              onChange={(e) => setJoinRoomText(e.target.value)}
            />
            <button className="button" onClick={joinRoom}>
              Join Room
            </button>
          </div>
        </>
      ) : (
        <div className="created-room">
          <p>Room ID: {roomId}</p>
          <CopyButton text={roomId} />
        </div>
      )}
    </div>
  );
};

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export default Popup;
