import React, {useState, useContext, useCallback, useEffect} from 'react';

function UserListEntry({userData}) {
    return (
        <div className="entry">
            <span className="placing">{userData.place==0 ? "" : "#"+userData.place }</span>
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
