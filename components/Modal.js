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
import SearchDropDown from './SearchDropDown';
import axios from 'axios';
import {
    SearchIcon,
  } from "@heroicons/react/outline"
import useSpotify from '../hooks/useSpotify.js';

function Modal() {

    const spotifyApi = useSpotify();
    const [open, setOpen] = useRecoilState(modalState);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const captionRef = useRef(null);
    const [searchKey, setSearchKey] = useState("");

    const [searchSongs, setSearchSongs] = useState([]);

    const search = async (e) => {
        e.preventDefault();
        if (session) {
            if (spotifyApi.getAccessToken()) {
                try {
                    spotifyApi.searchTracks(searchKey).then((data) => {
                        setSearchSongs(data.body.tracks.items);
                        console.log(searchSongs);
                    });
                } catch (error) {
                    console.log(error);
                }
                }
        }
        console.log(searchSongs);
    }


    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    };

    const uploadPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })
        console.log("New doc added with ID ", docRef.id);

        const imageRef = ref(storage, `posts/${docRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadURL
            })
        });
        setOpen(false);
        setLoading(false);
        setSelectedFile(null);
    }

    // console.log(searchKey);
    // console.log(searchSongs);
    
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
                sm:max-w-sm sm:w-full sm:p-6">
                        <div>
                            <div className="relative mt-1 p-3 rounded-md"> 
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <form onSubmit={search}> 
                                    <input className="bg-gray-50 block w-full pl-10 sm:text-sm
                                    border-gray-300 focus:ring-black focus:border-black rounded-md" 
                                    type="text"
                                    onChange={e => setSearchKey(e.target.value)}
                                    placeholder="Search a song"/>
                                    <SearchDropDown list={searchSongs}/>
                                </form>
                            </div>
                            <div>

                                <div>
                                    <input
                                        ref={filePickerRef}
                                        type="file"
                                        hidden
                                        onChange={addImageToPost}
                                    />
                                </div>

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
                                    disabled={!selectedFile}
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