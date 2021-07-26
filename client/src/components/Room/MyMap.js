import React, { useState } from 'react'
import { Map, Marker } from "pigeon-maps"

function MyMap({position}) {
  return (
    <div className="map">
      <Map height={300} width={300} center={position} zoom={11}>
        <Marker width={50} anchor={position} />
      </Map>
    </div>
  )
}

export default MyMap
