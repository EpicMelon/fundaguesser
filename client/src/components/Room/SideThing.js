import React, {useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import { SwipeableDrawer, Divider } from '@material-ui/core';

import LeaveGame from './LeaveGame';
import UserList from './UserList';
import ChatRoom from './ChatRoom';

import "../../css/sidebar.css";

function SideThing() {
    let { roomId } = useParams();
    const [open, setOpen] = useState(true);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <div>
            <SwipeableDrawer
                variant="persistent" anchor="right" open={open} className="sidething" size="medium"
                disableBackdropTransition={!iOS} disableDiscovery={iOS} classes={["sidething"]}
                style={{width:'50px'}}
            >
                <div className="headertje">
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
