import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext, socket} from '../../context/socket';

function Timer({deadline}) {
    const [time, setTime] = useState("");

    function calculateTime() {
        var milliseconds = deadline - Date.now();

        var seconds = milliseconds / 1000;

        var showTime = seconds.toFixed(1);

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
        <div className="timerDiv">
            <div className="timer" style={{width: time / 6 * 100 + "%"}}>
                {time}
            </div>
        </div>
    )
}

export default Timer
