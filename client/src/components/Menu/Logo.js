import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { useHistory } from "react-router-dom";

function Logo() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // confirmed
    const leaveGame = useCallback(() => {
        socket.emit("leaveRoom")
        history.push("/");
    }, []);

    return (
        <h1 className="logoStyle bigLogo" onClick={leaveGame}> FundaGuesser </h1>
    )
}

export default Logo
