import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function RoomBar({open, setOpen}) {
  function setOpenTrue() {
    setOpen(true);
  }
    return (
        <div>
          <AppBar position="static" style={{ background: '#F7A100' }}>
            <Toolbar>
              {!open ? <IconButton className="menuButton" color="inherit" aria-label="open drawer" edge="end" onClick={() => setOpenTrue()}> <MenuIcon /> </IconButton> : ""}
            </Toolbar>
          </AppBar>
        </div>
    )
}

export default RoomBar
