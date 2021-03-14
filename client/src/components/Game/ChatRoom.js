import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import ChatMessage from './ChatMessage';
import { useForm } from "react-hook-form";

function ChatRoom() {
    const socket = useContext(SocketContext);

    // Chat message form
    const { register, handleSubmit, watch, errors, reset } = useForm();

    const [messages, SetMessages] = useState([]);

    // send
    const sendMessage = useCallback((data) => {
        console.log("sending message " + data.msg + "...");

        socket.emit("sendMessage", data.msg);

        reset()
    }, []);

    // receive
    const showMessage = useCallback((msg) => {
        console.log("got message " + msg);

        SetMessages(msgs => [...msgs, msg]);
    }, []);

    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("showMessage", (msg) => showMessage(msg));
    
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("showMessage", (msg) => showMessage(msg));
        };
    }, [socket, showMessage]);

    return (
        <div>
            <form onSubmit={handleSubmit(sendMessage)}>
                <input name="msg" ref={
                    register({required: true, maxLength: 256}
                        )}
                placeholder={"message"} type="text" maxLength={256} autoComplete="off"/>
                <input type="submit" value="Send Message" />
            </form>

            <ul>
                { messages.map((msg, index) => (
                    <li key={index}> {msg} </li>
                ))}
            </ul>

        </div>
    )
} // <li key={index}> <ChatMessage text={messages[index]} index={index}/> </li>

export default ChatRoom
