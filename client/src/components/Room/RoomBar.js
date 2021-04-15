import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'

function RoomBar() {
    return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className="Title">
                FundaGuesser
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    )
}

export default RoomBar
