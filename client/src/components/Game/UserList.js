import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import UserListEntry from './UserListEntry';

function UserList() {
    const socket = useContext(SocketContext);

    const [players, setPlayers] = useState({})

    // confirmed
    const updateList = useCallback((data) => {
        console.log("client received: " + data + "!");
        console.dir(data);
        Object.keys(players).map((id, data) => (
            console.dir(data)
        ));

        setPlayers(data);
    }, []);

    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("updatePlayerList", (data) => updateList(data));
    
        // request data for render
        socket.emit("myGameDataRequest");

        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("updatePlayerList", (data) => updateList(data));
        };
    }, [socket, updateList]);

    return (
        <div>
            Users online:
            <ul>
            {Object.keys(players).map((id, i) => (
                <li key={i}>
                    <UserListEntry userData={players[id]}/>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default UserList
