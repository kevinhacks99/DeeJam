import React, { useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify';
import {useSession} from "next-auth/react"
import {
PlayIcon,
} from "@heroicons/react/solid"

function TopTracks() {
  const spotifyApi = useSpotify();
  const [myTopTracks, setMyTopTracks] = useState([]);
  
  const {data:session} = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
      if (session) {
          if (spotifyApi.getAccessToken()) {
              spotifyApi.getMyTopTracks({ limit: 15 }).then((data) => {
                  setMyTopTracks(data.body.items);
              });
              }
      }
      console.log(myTopTracks);
  }, [session, spotifyApi])

  return (
    <div className='mt-4 ml-10'>
        <div className= 'flex justify-between text-sm mb-5'>
            <h3 className='text-sm font-bold'> Your Top tracks </h3>
        </div>
        {myTopTracks.map(tracks => (
            <div key = {tracks.id} className="flex items-center justify-between mt-3 ">
                <img className='w-10 h-10 rounded-full border p-[2px]' src={tracks.album.images[0].url} alt=""/>
                
                <div className ="flex-1 ml-4">
                    <h2 className="font-semibold text-sm"> {tracks.name} </h2>  
                    <h3 className= "text-xs text-gray-400"> by {tracks.artists[0].name} </h3>   
                </div>
                <PlayIcon className="navButton" />
            </div>
        ))}
    </div>
  );
}

export default TopTracks