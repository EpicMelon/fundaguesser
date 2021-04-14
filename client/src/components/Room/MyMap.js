import React from "react"
import { Map, Marker } from "pigeon-maps"

function MyMap({position}) {
  return (
    <Map height={400} width={400} defaultCenter={position} defaultZoom={11}>
      <Marker width={50} anchor={position} />
    </Map>
  )
}

export default MyMap
