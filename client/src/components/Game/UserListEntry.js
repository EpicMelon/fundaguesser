import React, {useState, useContext, useCallback, useEffect} from 'react';

function UserListEntry({userData}) {
    useEffect(() => {console.dir(userData)})
    return (
        <div>
            {userData.username} is online {userData.leader ? (<p>[*]</p>) : (<p></p>)}
        </div>
    )
}

export default UserListEntry
