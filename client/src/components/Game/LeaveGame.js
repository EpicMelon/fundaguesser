import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { useHistory } from "react-router-dom";

function LeaveGame() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // confirmed
    const leaveGame = useCallback((id) => {
        socket.emit("leaveRoom")
        history.push("/");
    }, []);

    return (
        <div>
            <button onClick={leaveGame}>
                Leave Game
            </button>
        </div>
    )
}

export default LeaveGame
