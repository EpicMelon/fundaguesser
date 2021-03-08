import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import {SocketContext, socket} from '../context/socket';

import Logo from './Menu/Logo';

import SetName from './Game/SetName';
import GameLobby from './Game/GameLobby';

import '../css/base.css';

const Game = () => {
    let { roomId } = useParams();
    const history = useHistory();

    const [joined, setJoined] = useState(false);


    // request
    const setNameAndJoin = useCallback((data) => {
        console.log("Setting name to " + data.name);
        socket.emit("setUsername", data.name);

        console.log("requesting to join game " + roomId + "...");
        socket.emit("requestJoinRoom", roomId);
    }, []);

    // confirmed
    const joinGameConfirmed = useCallback((id) => {
        console.log("server confirmed I join room " + id + "!");
        setJoined(true);
    }, []);

    const joinGameDenied = useCallback((msg) => {
        console.log("I could not joined: " + msg);
    
        history.push({pathname: "/", state:{error:msg}});
    }, []);

    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("confirmedJoinRoom", (id) => joinGameConfirmed(id));
        socket.on("error", (msg) => joinGameDenied(msg));
    
        // Ask if allowed into the game
        socket.emit("checkIfAllowed", roomId);
        
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("confirmedJoinRoom", (id) => joinGameConfirmed(id));
            socket.on("error", (msg) => joinGameDenied(msg));
        };
    }, [socket, joinGameConfirmed, joinGameDenied]);

    return (
        <SocketContext.Provider value={socket}>
            {joined ? (
                <div>
                    <GameLobby/>
                </div>     
                ) : (
                <div>
                    <Logo/>
                    <SetName onNameSubmission={setNameAndJoin}/>
                </div>)
            }
        </SocketContext.Provider>
    );
}

export default Game;
