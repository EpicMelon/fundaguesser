import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../context/socket';

const Secondbutton = ({userId}) => {
  const socket = useContext(SocketContext);

  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(0);

  const handleInviteAccepted = useCallback(() => {
    console.log("handleInviteAccepted");

    setJoined(wtf => true);
    setCount(prevCount => prevCount + 1);
  }, []);

  const handleJoinChat = useCallback(() => {
    console.log("handleJoinChat");

    socket.emit("SEND_JOIN_REQUEST");
  }, []);


  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    socket.emit("USER_ONLINE", userId); 

    // subscribe to socket events
    socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    };
  }, [socket, userId, joined]);

  return (
    <div>
      {
      joined ? (
        <p> OMG WADDUP HUH ?? FUCK FUCK BITCH {joined} </p>
      ) : (
        <p>YOOO YOU IN THE GAME LOL {joined} ttaaa</p>
      ) }
      <button onClick={handleJoinChat}>
        Join Chat
      </button>
        Count : {count}
        {joined ? <p>(joined=TRUE)</p> : <p>(joined=FALSE)</p> }
    </div>
  );
};

export default Secondbutton;