import React, {useState} from 'react'

import { SwipeableDrawer, Divider } from '@material-ui/core';

import LeaveGame from './LeaveGame';
import UserList from './UserList';
import ChatRoom from './ChatRoom';

function SideThing() {
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
                disableBackdropTransition={!iOS} disableDiscovery={iOS}
            >
                <UserList />
                <Divider />
                <ChatRoom />
                <LeaveGame />
            </SwipeableDrawer>
        </div>
    )
}

export default SideThing
