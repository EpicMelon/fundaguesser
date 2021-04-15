import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import Display from './Display';
import Timer from './Timer';
import Input from './Input';

import Result from './Result';

import Button from '@material-ui/core/Button';

import {SocketContext, socket} from '../../context/socket';

function euroFormat(amount) {
    var dotted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return "€" + dotted + ",-"
}

function GameInterface({sidebar}) {
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

    const [winners, setWinners] = useState([]);
    const endGame = useCallback((data) => {
        setStarted(false);
        setEnded(true);
        console.log("ENDING GAME! !!! GOT DATA:");

        // Determine winner
        console.dir(data)

        // we could show big end screen or something
        var win = [];
        for (const [key, value] of Object.entries(data)) {
            if (data[key].place == 1) {
                win.push(data[key].username);
            }
        }
        setWinners(win);
    })

    // --- GAME ---
    const [currentGuess, setCurrentGuess] = useState("0");

    const makeGuess = useCallback((amount) => {
        socket.emit("guess", amount);

        setCurrentGuess(euroFormat(amount));
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
            <div className={sidebar ? "gameDiv sidebarActive" : "gameDiv"}>
                <Timer deadline={roundData.timer}/>
                
                {roundData.house ? <Display house={roundData.house}/> : "Could not load house"}
                {resultScreen ? (<Result results={resultData} myId={socket.id}/>) : ""}
                {!resultScreen ? (<Input currentGuess={currentGuess} makeGuess={makeGuess}/>) : ""}
            </div>
        )
    }

    if (ended) {
        return (
            <div className={sidebar ? "gameDiv sidebarActive" : "gameDiv"}>
                {winners.length == 1 ? winners[0] + "won!" : winners.map((value) => (value + ", ")) + "won!"}
                {leader ? (
                    <Button variant="contained" color="primary"
                    className="blueButton bigButton" onClick={startGame}> Start New Game! </Button>
                ) : (
                    <h2> The lobby leader can start a new game...</h2>
                )}
            </div>
        )
    }

    return (
        <div className={sidebar ? "gameDiv sidebarActive" : "gameDiv"}>
            {leader ? (
                <Button variant="contained" color="primary"
                className="blueButton bigButton startButton" onClick={startGame}> Start Game </Button>
            ) : (
                <h2 className="wait"> Wait for the lobby leader to start the game..</h2>
            )}
        </div>
    )
}

export default GameInterface
