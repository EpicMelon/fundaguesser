import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { Button } from '@material-ui/core';

import { useHistory } from "react-router-dom";

function LeaveGame() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // confirmed
    const leaveGame = useCallback(() => {
        socket.emit("leaveRoom")
        history.push("/");
    }, []);

    return (
        <Button variant="contained" color="secondary" size="small"
            className="leaveButton" onClick={leaveGame}>
            Leave Game
        </Button>
    )
}

export default LeaveGame
