import Image from "next/image";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
  HomeIcon,
} from "@heroicons/react/outline"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom.js";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify.js";

function Header() {

  const {data: session} = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  const [searchKey, setSearchKey] = useState("");

  const spotifyApi = useSpotify();
  const [myTopArtists, setMyTopArtists] = useState([]);

  console.log(session?.user);
  console.log(searchKey);



  return (
    <div className="shadow-sm border-b bg-white stick top-0 z-50"> 
        <div className="flex justify-between max-w-6xl mx-5 xl:mx-auto">
            <div className=""> 
              <h1 className='pt-4 text-center relative hidden lg:inline-grid h-16 w-24 font-bold text-2xl'> 𝓓𝓮𝓮𝓙𝓪𝓶 </h1> 
            </div>
            <div onClick={() => router.push('/')} className='relative w-16 h-18 lg:hidden flex-shrink-0 cursor-pointer'>
                <Image src="https://static.wikia.nocookie.net/pixel-gun-3d/images/6/6e/Mr._Deejay.png/revision/latest?cb=20181006104406" 
                layout="fill" 
                objectFit="contain"
                />
            </div>

        {/* <div className="max-w-xs">
          <div className="relative mt-1 p-3 rounded-md"> 
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <form> 
              <input className="bg-gray-50 block w-full pl-10 sm:text-sm
              border-gray-300 focus:ring-black focus:border-black rounded-md" 
              type="text"
              onChange={e => setSearchKey(e.target.value)} 
              placeholder="Search"
            />
            </form>

          </div>
        </div> */}

        <div className="flex items-center justify-end space-x-4"> 
          <HomeIcon onClick={() => router.push('/')} className="navButton" />
          <MenuIcon className="h-10 w-10 md:hidden cursor-pointer" />
          
          {session ? (
            <>
          <PlusCircleIcon onClick={() => setOpen(true)} className="navButton"/>
          {/* <UserGroupIcon className="navButton" />
          <HeartIcon className="navButton" /> */}

          <img onClick={signOut} src={session?.user?.image}
          alt="profile pic" className="navButton w-14 h-14 rounded-full cursor-pointer" />
          </>     
          ): (
            <button onClick={signIn}> Sign In </button>
          )}
        </div>
        </div>

    </div>
  );
}

export default Header