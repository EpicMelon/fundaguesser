import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { useHistory } from "react-router-dom";

const Testbutton = ({userId}) => {
  const socket = useContext(SocketContext);

  const history = useHistory();

  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(0);

  const handleInviteAccepted = useCallback(() => {
    console.log("handleInviteAccepted");

    setJoined(true);
    setCount(prevCount => prevCount + 1);

    history.push("/69")
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
  }, [socket, userId, handleInviteAccepted]);

  return (
    <div>
      {
      joined ? (
        <p>Click the button to send a request to join chat! {joined} </p>
      ) : (
        <p>Congratulations! You are accepted to join chat! {joined} ttaaa</p>
      ) }
      <button onClick={handleJoinChat}>
        Join Chat
      </button>
        Count : {count}
        {joined ? <p>(joined=TRUE)</p> : <p>(joined=FALSE)</p> }
    </div>
  );
};

export default Testbutton;