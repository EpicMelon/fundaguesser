import React, {useState, useContext, useCallback, useEffect} from 'react';
import ImageGallery from 'react-image-gallery';

function Display({house}) {
    useEffect(() => {
    })

    return (
        <div>
            <div>
                {/* {<h1>{house["Buitenruimte"]["ligging"]}</h1>}
                <ul>
                  {Object.keys(house["Oppervlakte en inhoud"]).map((id, i) => (
                      <li key={i}>
                          {id}: {house["Oppervlakte en inhoud"][id]}
                      </li>
                  ))}
                </ul> */}
            </div>
            {<div><ImageGallery items={house.images} /></div>}
        </div>
    )
}
export default Display
