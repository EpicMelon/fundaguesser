import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext, socket} from '../../context/socket';

import '../../css/timer.css'

function Timer({deadline}) {
    const [time, setTime] = useState("");

    function calculateTime() {
        var milliseconds = deadline - Date.now();

        var seconds = milliseconds / 1000;

        var showTime = seconds.toFixed();

        if (seconds > 0)
            return showTime;
        return "";
    }

    // Timer
    useEffect(() => {
        var timeout = setInterval(() => {
            setTime(calculateTime());
        }, 10);
        
        return () => {
            clearInterval(timeout);
        }
    })

    return (
        <div className="timer">
            <span className="timerText">{time}s</span>
        </div>
    )
}

export default Timer
