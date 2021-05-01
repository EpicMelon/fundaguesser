import React, {useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import { SwipeableDrawer, Divider } from '@material-ui/core';

import LeaveGame from './LeaveGame';
import UserList from './UserList';
import ChatRoom from './ChatRoom';

import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import "../../css/sidebar.css";

function SideThing({open, setOpen}) {
    let { roomId } = useParams();

    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

    function close() {
        setOpen(false);
    }

    return (
        <div>
            <SwipeableDrawer
                variant="persistent" anchor="right" open={open} className="sidething" size="medium"
                disableBackdropTransition={!iOS} disableDiscovery={iOS} classes={["sidething"]}
                style={{width:'50px'}}
            >
                <div className="headertje">
                    <div className="hideButton">
                        <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={close}>
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                    <div className="roomNameDiv"> <h1 className="roomNumber"> Lobby {roomId} </h1> </div>
                    <div className="linkDiv"> <h1 className="link"> https://fundaguesser.nl/{roomId} </h1> </div>
                </div>

                <Divider />
                <UserList />
                <Divider />
                <ChatRoom />
            </SwipeableDrawer>
        </div>
    )
}

export default SideThing
