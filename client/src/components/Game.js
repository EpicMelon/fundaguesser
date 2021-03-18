import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import {SocketContext, socket} from '../context/socket';

import Logo from './Menu/Logo';

import SetName from './Game/SetName';
import LeaveGame from './Game/LeaveGame';
import UserList from './Game/UserList';
import ChatRoom from './Game/ChatRoom';

import GameInterface from './Game/GameInterface';

import '../css/base.css';
import '../css/menu.css';
import '../css/game.css';

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
            socket.off("error", (msg) => joinGameDenied(msg));
        };
    }, [socket, joinGameConfirmed, joinGameDenied]);

    return (
        <SocketContext.Provider value={socket}>
        <link rel="stylesheet" href="https://use.typekit.net/njp2ius.css"></link>
            {joined ? (
                <div>
                    <LeaveGame />
                    <div className="welcome"> <h1 className="welcomeText"> You are in lobby {roomId} </h1> </div>
                    <UserList />
                    <ChatRoom />
                    <GameInterface />
                </div>
                ) : (
                <div>
                    <Logo/>
                    <div className="welcome"> <h1 className="welcomeText"> Lobby {roomId} </h1> </div>
                    <SetName onNameSubmission={setNameAndJoin}/>
                </div>)
            }
        </SocketContext.Provider>
    );
}

export default Game;
