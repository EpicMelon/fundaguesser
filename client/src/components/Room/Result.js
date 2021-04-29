import React from 'react'

import '../../css/results.css'

function euroFormat(amount) {
    var dotted = parseInt(amount).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return "€" + dotted + ",-"
}

function Result({results, myId}) {
    return (
        <div className="results">
            <div className="correct">
                <p className="correctLabel">echte vraagprijs:</p>
                <p className="correctPrice">{euroFormat(results.correct)}</p>
            </div>
            <p className="yourAnswer"><b>You</b> guessed <span className="guess">{euroFormat(results.playersData[myId].guess)} </span>
                <span className="deltaPoints">(+{results.playersData[myId].deltaPoints.toFixed(0)})</span></p>

            <ul>
            {Object.keys(results.playersData).map((id, i) => (
                (id == myId) ? (
                    ""
                ) :
                (
                    <li key={i}>
                        <b>{results.playersData[id].username}</b> guessed <span className="guess">{euroFormat(results.playersData[id].guess)}</span>
                        <span className="deltaPoints"> (+{results.playersData[id].deltaPoints.toFixed(0)})</span>
                    </li>
                )
            ))}
            </ul>
        </div>
    )
}

export default Result
