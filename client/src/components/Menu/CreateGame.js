import React, {useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';

function CreateGame() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // request
    const createGameRequest = useCallback(() => {
        console.log("requesting to make a game...");
        socket.emit("createRoom");
    }, []);

    // confirmed
    const createGameConfirmed = useCallback((id) => {
        console.log("server confirmed I created room " + id + "!");
    
        history.push("/" + id);
    }, []);

    // Set up
    useEffect(() => {    
        // subscribe to socket events
        socket.on("createRoomConfirmed", (id) => createGameConfirmed(id));
    
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("createRoomConfirmed", (id) => createGameConfirmed(id));
        };
    }, [socket, createGameConfirmed]);

    return (
        <Button size="large" variant="contained" color="primary"
            m={2} pt={3}
            onClick={createGameRequest} className="create">
            Create Game
        </Button>
    )
}

export default CreateGame
