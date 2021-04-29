import React, {useState, useContext, useCallback, useEffect} from 'react';
import ImageGallery from 'react-image-gallery';

import MyMap from './MyMap';

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

function PrettyStreetName(street) {
  var result = street.replace(/-/g, " ");
  result = titleCase(result);
  return result;
}

function Display({house, hideNav}) {
    useEffect(() => {
      console.log("Showing house:");
      console.dir(house);
    })

    return (
        <div className="display">
          <div className="topThings">
            <div className="images">
              <ImageGallery items={house.images} slideDuration="0" showNav={!hideNav} showFullscreenButton={!hideNav} showPlayButton={!hideNav}/>
            </div>

            <MyMap position={house["position"]}/>
          </div>

          <div className="title">
              <h1>{PrettyStreetName(house["street"])}</h1>
          </div>

          <div className="properties">
            <ul>
              <li key={-5}>{house["Buitenruimte"]["Ligging"]}</li>
              {Object.keys(house["Oppervlakten en inhoud"]).map((id, i) => (
                  <li key={i}>
                      {id}: {house["Oppervlakten en inhoud"][id]}
                  </li>
              ))}
            </ul>
          </div>


        </div>
    )
}
export default Display
