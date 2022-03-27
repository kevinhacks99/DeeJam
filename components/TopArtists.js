import React, { useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify';
import {useSession} from "next-auth/react"
import {
PlayIcon,
} from "@heroicons/react/solid"
import Artists from './Artists';

function TopArtists() {
  const spotifyApi = useSpotify();
  const [myTopArtists, setMyTopArtists] = useState([]);
  const {data:session} = useSession();
  
  useEffect(() => {
      if (session) {
          if (spotifyApi.getAccessToken()) {
              spotifyApi.getMyTopArtists().then((data) => {
                setMyTopArtists(data.body.items);
              });
              }
      }
      console.log(myTopArtists);
  }, [session, spotifyApi])

  return (

    <div className='flex space-x-2 p-6 bg--white mt-8 border-gray-200 
    border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-green-600'>
        <h1 className='font-bold'> Your Top Artists </h1>
        {myTopArtists.map(artists => (
          <Artists key = 
          {artists.id} 
          albumCover={artists.images[0].url}
          artistName={artists.name} 
          />
        ))}
    </div>
  )
}

export default TopArtists