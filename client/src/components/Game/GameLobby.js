import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import LeaveGame from './LeaveGame';
import UserList from './UserList';
import ChatRoom from './ChatRoom';

function GameLobby() {
    let { roomId } = useParams();

    return (
        <div>
            <LeaveGame />
            <h1> Welcome to Room {roomId} </h1>
            <UserList />
            <ChatRoom />
        </div>
    )
}

export default GameLobby
