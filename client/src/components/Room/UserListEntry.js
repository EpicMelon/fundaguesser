import React, {useState, useContext, useCallback, useEffect} from 'react';

function UserListEntry({userData}) {
    useEffect(() => {console.dir(userData)})
    return (
        <div className="entry">
            <span className="placing">#1</span>
            <div className="info">
                <b className="username">{userData.username}</b>
                {userData.leader ? ("*") : ("")}
                <span className="points"> {userData.points.toFixed(0)} points</span>
                {/* {userData.deltaPoints ? (<span className="deltaPoints">(+{userData.deltaPoints.toFixed(0)}!)</span>) : ("")} */}
            </div>
        </div>
    )
}

export default UserListEntry
