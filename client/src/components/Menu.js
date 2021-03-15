import {SocketContext, socket} from '../context/socket';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { useLocation } from "react-router-dom";

import Logo from './Menu/Logo';
import CreateGame from './Menu/CreateGame';
import JoinGame from './Menu/JoinGame';

import '../css/base.css';
import '../css/menu.css';

const Menu = () => {
    const location = useLocation();

    const [error, setError] = useState("");

    useEffect( () => {
        socket.on("error", (err) => {setError(err)});

        if (location.state) {
            if (location.state.error) {
                setError(location.state.error);
                location.state.error = "";
            }
        }
        return () => {
            socket.off("error", (err) => {setError(err)});
        }
    })
    
    return (
        <SocketContext.Provider value={socket}>
            <link rel="stylesheet" href="https://use.typekit.net/njp2ius.css"></link>
            <div className="Menu">
                <div>
                    <Logo/>
                </div>
                <div>
                    <div className="createDiv"> <CreateGame/> </div>
                    <div className="joinDiv"> <JoinGame /> </div>
                    
                </div>
                {error ? (<div className="error"> Error: {error} </div>) : (<div></div>)}
            </div>
        </SocketContext.Provider>
    );
}

export default Menu;
