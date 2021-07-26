import {SocketContext, socket} from '../context/socket';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { useLocation } from "react-router-dom";

import Logo from './Menu/Logo';
import CreateGame from './Menu/CreateGame';
import JoinGame from './Menu/JoinGame';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../context/color';

import '../css/landing.css';

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
            <MuiThemeProvider theme={theme}>
                <link rel="stylesheet" href="https://use.typekit.net/njp2ius.css"></link>

                <div className="menu">
                    <div className="logoDiv">
                        <Logo/>
                    </div>

                    <div className="buttons">
                        <CreateGame/>
                        <JoinGame />
                    </div>

                    {error ? (<div className="error"> Error: {error} </div>) : (<div></div>)}
                </div>
            </MuiThemeProvider>
        </SocketContext.Provider>
    );
}

export default Menu;
