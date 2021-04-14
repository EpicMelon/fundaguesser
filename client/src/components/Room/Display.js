import React, {useState, useContext, useCallback, useEffect} from 'react';
import ImageGallery from 'react-image-gallery';

import MyMap from './MyMap';

import '../../css/display.css';

function Display({house}) {
    useEffect(() => {
      console.log("Showing house:");
      console.dir(house);
    })

    return (
        <div className="display">
          <div className="title">
            <h1>{house["Buitenruimte"]["Ligging"]}</h1>
          </div>

          <div className="properties">
            <ul>
              {Object.keys(house["Oppervlakten en inhoud"]).map((id, i) => (
                  <li key={i}>
                      {id}: {house["Oppervlakten en inhoud"][id]}
                  </li>
              ))}
            </ul>
          </div>

          <MyMap position={[52.384838, 4.871]}/>

          <div className="images">
            <ImageGallery items={house.images} />
          </div>
        </div>
    )
}
export default Display
