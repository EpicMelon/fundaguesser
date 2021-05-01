import React, {useContext, useCallback, useEffect, useState, useRef} from 'react';
import { useHistory, useParams } from "react-router-dom";

import {SocketContext, socket} from '../context/socket';

import Logo from './Menu/Logo';

import RoomBar from './Room/RoomBar';
import SetName from './Room/SetName';

import SideThing from './Room/SideThing';

import GameInterface from './Room/GameInterface';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../context/color';

import '../css/gamepage.css';

const Room = () => {
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

    const [sidebarActive, setsidebarActive] = useState(true);
    
    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("confirmedJoinRoom", (id) => joinGameConfirmed(id));
        socket.on("error", (msg) => joinGameDenied(msg));
    
        // Ask if allowed into the game
        socket.emit("checkIfAllowed", roomId);

        // Mobile has sidebar default hidden
        if (window.innerWidth < 450) {
            setsidebarActive(false);
        }
        
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("confirmedJoinRoom", (id) => joinGameConfirmed(id));
            socket.off("error", (msg) => joinGameDenied(msg));
        };
    }, [socket, joinGameConfirmed, joinGameDenied]);

    function openDrawer() {
        console.log("Wow!!");
        setsidebarActive(true);
    }

    return (
        <SocketContext.Provider value={socket}>
        <MuiThemeProvider theme={theme}>
        <link rel="stylesheet" href="https://use.typekit.net/njp2ius.css"></link>
            {joined ? (
                <div className="room">
                    <RoomBar open={sidebarActive} setOpen={setsidebarActive}/>
                    <SideThing open={sidebarActive} setOpen={setsidebarActive}/>

                    <GameInterface sidebar={sidebarActive}/>
                </div>
                ) : (
                <div className="menu">
                    <div className="logoDiv">
                        <Logo/>
                    </div>

                    <div className="buttons">
                        <div className="roomNameDiv"> <h1 className="roomName"> Lobby {roomId} </h1> </div>
                        <SetName onNameSubmission={setNameAndJoin}/>
                    </div>
                </div>)
            }
            </MuiThemeProvider>
        </SocketContext.Provider>
    );
}

export default Room;