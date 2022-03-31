import { async } from '@firebase/util';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/outline';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Fragment, useRef, useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom.js';
import { db, storage } from "../firebase";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import axios from 'axios';
import { ToggleButton } from '@mui/material';
import {
    SearchIcon,
  } from "@heroicons/react/outline";
  import {
    PlayIcon,
    PauseIcon,
    } from "@heroicons/react/solid"
import useSpotify from '../hooks/useSpotify.js';

function Modal() {

    const spotifyApi = useSpotify();
    const [open, setOpen] = useRecoilState(modalState);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const captionRef = useRef(null);
    const [searchKey, setSearchKey] = useState("");
    const [searchSongs, setSearchSongs] = useState([]);
    const [previewSong, setPreviewSong] = useState([]);
    const [postImage, setPostImage] = useState([]);
    const [postName, setPostName] = useState([]);
    const [postArtist, setPostArtist] = useState([]);
    const [externalSongURL, setExternalSongURL] = useState([]);
    const [songID, setSongID] = useState([]);

    var audio;

    const search = async (e) => {
        e.preventDefault();
        if (session) {
            if (spotifyApi.getAccessToken()) {
                try {
                    if (searchKey.length != 0) {
                        setSearchKey("track:" + searchKey.substring(0, searchKey.indexOf(" ")) + " artist:" + searchKey.substring(searchKey.indexOf(" ", searchKey.length)));
                        spotifyApi.searchTracks(searchKey,{ limit: 10 }).then((data) => {
                        setSearchSongs(data.body.tracks.items);
                        });  
                    }
                } catch (error) {
                    console.log(error);
                }
                }
        }
        console.log(searchSongs);
    }

    const playSong = (e) => {
        if (previewSong != null) {
            audio = new Audio(previewSong);
            audio.paused ? audio.play() : audio.pause();
        };
    }

    const uploadPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
            song: postName,
            artist:postArtist,
            songPic: postImage,
            externalSongURL: externalSongURL,
            songID: songID,
        })
        console.log("New doc added with ID ", docRef.id);

        setOpen(false);
        setLoading(false);
        setSelectedSong(null);
    }
    
    return <Transition.Root show={open} as={Fragment}>
        <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={setOpen}
        >
            <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen
          pt-4 px-4 pb-20 text-center sm:block sm:p-0' >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    >
                    </Dialog.Overlay>
                </Transition.Child>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div className="inline-block align-bottom bg-white rounded-lg px-4pb-4
                text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle
                sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                        <div className="max-w-lg">
                            <div className="relative mt-1 p-3 rounded-md"> 
                                <div className="absolute inset-y-0 pl-3 pt-3 pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <form onSubmit={search}> 
                                    <input className="bg-gray-50 block w-full pl-10 sm:text-sm
                                    border-gray-300 focus:ring-black focus:border-black rounded-md" 
                                    onChange={e => {setSearchKey(e.target.value);}}
                                    placeholder="Search a song"/>
                                </form>
                                    <div className ="mt-4">
                                    {searchSongs.map(songs =>(
                                        <div className="flex justify-between mt-3 hover:bg-green-400 cursor-pointer hover:Scale-125 transition-all duration-150 rounded-md">
                                        <ToggleButton className="flex-1" onClick={e => 
                                            {console.log(songs);
                                            setSongID(songs.id);
                                            console.log(songs.external_urls.spotify);
                                            setExternalSongURL(songs.external_urls.spotify);
                                            setPreviewSong(songs.preview_url); 
                                            setPostImage(songs.album.images[0].url);
                                            setPostName(songs.name);
                                            setPostArtist(songs.artists[0].name);
                                            setSelectedSong(true);
                                            }}>
                                        <div className="flex-1 items-center">
                                            <div key = {songs.id} className="flex items-center justify-between" onClick={e => {setSearchKey(songs.id);}}>
                                                <img className='w-12 h-12 border p-[2px] align' src={songs.album.images[0].url}  alt ="" />
                                                <div className ="flex-1 ml-4 ">
                                                    <h2 className="text-black text-sm"> {songs.name} </h2>  
                                                    <h3 className= "text-xs text-black"> by {songs.artists[0].name} </h3>
                                                </div>
                                            </div>
                                        </div>
                                        </ToggleButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                            <div>
                                <div className="mt-2">
                                    <input
                                        className="border-none focus:ring-0 w-full text-center"
                                        text="text"
                                        ref={captionRef}
                                        placeholder="Please enter a caption ... "
                                    />
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button type="button"
                                    disabled={!selectedSong}
                                    className="inline-flex justify-center w-full rounded-md border border-transparent
                            shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white
                            hover:bg-red-700 focus:outline-none focus-ring-2 focus:ring-offset-2
                            focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                                    onClick={uploadPost}>
                                    {loading ? "Uploading..." : "Upload Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>
};

export default Modal