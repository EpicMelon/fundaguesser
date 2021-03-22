import React, {useState, useContext, useCallback, useEffect} from 'react';
import ImageGallery from 'react-image-gallery';

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];

function Display({house}) {
    useEffect(() => {
        console.log("Display received object:");
        console.dir(house.images);
    })
    return (
        <div>
            <div>
                {house.title}
                {<ul>
                {Object.keys(house.information).map((id, i) => (
                    <li key={i}>
                        {id}: {house.information[id]}
                    </li>
                ))}
                </ul>}
            </div>
            <div><ImageGallery items={house.images} /></div>
        </div>
    )
}
export default Display
