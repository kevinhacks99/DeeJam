import React from 'react'
import { getProviders, signIn } from "next-auth/react";

function login({providers}) {
  return (
    <div className='flex flex-col items-center bg-white min-h-screen w-full justify-center'>
      <img className="w-52 mb-5" src= "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png" onClick={() => signIn(provider.id, {callbackUrl: "/"})} />
      {Object.values(providers).map((provider) => (
      <div key = {provider.name}>
        <button className="bg-[#18D860] text-white p-5 rounded-full cursor-pointer 
        hover:scale-125 transition-all duration-150 ease-out" 
        onClick={() => signIn(provider.id, {callbackUrl: "/"})}> 
          Login with {provider.name} 
        </button>
      </div>
    ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    }
  }
}