import React from 'react'
import MiniProfile from './MiniProfile'
import {useSession} from "next-auth/react"
import TopTracks from './TopTracks';
import Artists from './Artists';
import TopArtists from './TopArtists';
import Posts from './Posts';

function Feed() {

  const {data:session} = useSession();

  return (
    <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3
    xl:max-w-6xl mx-auto ${!session && "!grid-cols-1 !max-w-3xl"}`}>
        
        <section className="col-span-2">
            <TopArtists />
            <Posts />
        </section>
    
    {session && (
        <section className='hidden xl:inline-grid md:col-span-1'>
        <div className = 'fixed top-20'>
          <MiniProfile />
          <TopTracks />
        </div>
      </section>
    )}

    </main>
  );
}

export default Feed