import React from 'react'

function Result({results, myId}) {
    return (
        <div>
            <p>Correct answer {results.correct}</p>
            <ul>
            {Object.keys(results.playersData).map((id, i) => (
                (id == myId) ? (
                    <li key={i}>
                        ***{results.playersData[id].username}: guessed {results.playersData[id].guess} (+{results.playersData[id].deltaPoints})***
                    </li>
                ) :
                (
                    <li key={i}>
                        {results.playersData[id].username}: guessed {results.playersData[id].guess} (+{results.playersData[id].deltaPoints})
                    </li>
                )
            ))}
            </ul>
        </div>
    )
}

export default Result
