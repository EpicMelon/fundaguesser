import React, {useState, useContext, useCallback, useEffect} from 'react';

function UserListEntry({userData}) {
    return (
        <div className="entry">
            <div className="placing">
                {userData.place==0 ? "" : "#"+userData.place }
            </div>
            <div className="username">
                <b>{userData.username} {userData.leader ? ("*") : ("")}</b>
            </div>
            <div className="points">
                <span className="total"> {userData.points.toFixed(0)} points</span>
                {userData.deltaPoints ? (<span className="deltaPoints">(+{userData.deltaPoints.toFixed(0)}!)</span>) : ("")}
            </div>
        </div>
    )
}

export default UserListEntry
