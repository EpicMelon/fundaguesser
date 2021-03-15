import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';
import { ID_SIZE } from "../../context/config";

import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

function JoinGame() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // Join game form
    const { register, handleSubmit, watch, errors } = useForm();

    // request
    const joinGameRequest = useCallback((data) => {
        console.log("requesting to join game " + data.inputId + "...");

        socket.emit("requestJoinRoom", data.inputId);
    }, []);

    // confirmed
    const joinGameConfirmed = useCallback((id) => {
        console.log("server confirmed I join room " + id + "!");
    
        history.push("/" + id);
    }, []);

    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("confirmedJoinRoom", (id) => joinGameConfirmed(id));
    
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("confirmedJoinRoom", (id) => joinGameConfirmed(id));
        };
    }, [socket, joinGameConfirmed]);

    return (
        <form onSubmit={handleSubmit(joinGameRequest)}>
            <div>
                <input name="inputId" ref={
                    register({required: true, minLength: ID_SIZE, maxLength: ID_SIZE}
                        )}
                placeholder={"0".repeat(ID_SIZE)} type="text" maxLength={ID_SIZE} autoComplete="off"
                className="whiteWrite joinWrite"/>
                <input type="submit" value="Join Game" className="blueButton joinButton"/>
            </div>
        </form>
    )
}

export default JoinGame
