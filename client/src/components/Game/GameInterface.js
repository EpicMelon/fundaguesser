import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import logo from '../../images/logo.png';

import {SocketContext, socket} from '../../context/socket';

function GameInterface() {
    const socket = useContext(SocketContext);

    const [started, setStarted] = useState(false);
    const [leader, setLeader] = useState(false);

    // --- GAME STATE ---

    const requestGameState = useCallback(() => {
        console.log("requesting if game started...");
        socket.emit("requestGameState");
    }, []);
    const updateGameState = useCallback((data) => {    
        setStarted(data.started);
        setLeader(data.leader);
    }, []);

    const startGame = useCallback(() => {    
        console.log("Requesting to startgame...");
        socket.emit("startGame");
    }, []);

    // Set up
    useEffect(() => {    
        // subscribe to socket events
        socket.on("updateGameState", (data) => updateGameState(data));
    
        requestGameState();

        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("updateGameState", (data) => updateGameState(data));
        };
    }, [socket, updateGameState]);

    return (
        <div>
            {started ? (
                <div>
                     look at this house
                     <img src={logo} alt="Logo" />;
                </div>


                ) : (


                    leader ? (
                    <button className="blueButton bigButton" onClick={startGame}> Start Game </button>
                    ) :
                    (<h2> Wait for the lobby leader to start the game..</h2>
                    )
                )
            }
        </div>
    )
}

export default GameInterface
