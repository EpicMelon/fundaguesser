import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import Display from './Display';
import Timer from './Timer';
import Input from './Input';

import Result from './Result';

import {SocketContext, socket} from '../../context/socket';

function GameInterface() {
    const socket = useContext(SocketContext);

    // --- PREGAME ---

    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);
    const [leader, setLeader] = useState(false);

    const [resultScreen, setResultScreen] = useState(false);

    const requestGameState = useCallback(() => {
        console.log("requesting if game started...");
        socket.emit("requestGameState");
    }, []);

    const updateLeader = useCallback((leaderBoolean) => {
        setLeader(leaderBoolean);
    }, []);

    const startGame = useCallback(() => {    
        console.log("Requesting to startgame...");
        socket.emit("startGame");
    }, []);

    // --- CURRENT ROUND ---

    const [roundData, setRoundData] = useState({});

    const updateRoundData = useCallback((data) => {
        console.log("[round] Received data");
        console.dir(data);

        setRoundData(data);

        setStarted(true);
        setEnded(false);
        
        setResultScreen(false);

        // default guess
        makeGuess(0);
    }, []);

    const endGame = useCallback((data) => {
        setStarted(false);
        setEnded(true);
        console.log("ENDING GAME! !!! ");

        // we could show big end screen or something
    })

    // --- GAME ---
    const [currentGuess, setCurrentGuess] = useState(0);

    const makeGuess = useCallback((amount) => {
        socket.emit("guess", amount);
        setCurrentGuess(amount);
    })


    // --- RESULTS ---
    const [resultData, setResultData] = useState({});

    const showResults = useCallback((data) => {
        console.log("[results] Received data");
        console.dir(data);

        setResultData(data);
        setResultScreen(true);
    }, []);


    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("updateLeader", (data) => updateLeader(data));
        socket.on("startRound", (data) => updateRoundData(data));
        socket.on("showResults", (data) => showResults(data));
        socket.on("endGame", (data) => endGame(data));
    
        requestGameState();

        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("updateLeader", (data) => updateLeader(data));
            socket.off("startRound", (data) => updateRoundData(data));
            socket.off("showResults", (data) => showResults(data));
            socket.off("endGame", (data) => endGame(data));
        };
    }, [socket, updateLeader, updateRoundData, showResults]);


    if (started) {
        return (
            <div>
                {resultScreen ? (<Result results={resultData} myId={socket.id}/>) : ""}
                <Timer deadline={roundData.timer}/>
                <Input currentGuess={currentGuess} makeGuess={makeGuess}/>
                {roundData.house ? <Display house={roundData.house}/> : "Could not load house"}
            </div>
        )
    }

    if (ended) {
        return (
            <div>
                <Result results={resultData} myId={socket.id}/>
                {leader ? (
                    <button className="blueButton bigButton" onClick={startGame}> Start New Game! </button>
                ) : (
                    <h2> The lobby leader can start a new game...</h2>
                )}
            </div>
        )
    }

    return (
        <div>
            {leader ? (
                <button className="blueButton bigButton" onClick={startGame}> Start Game </button>
            ) : (
                <h2> Wait for the lobby leader to start the game..</h2>
            )}
        </div>
    )
}

export default GameInterface
