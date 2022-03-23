import React from 'react'
import { getProviders, signIn } from "next-auth/react";

function login({providers}) {
  return (
    <div>

      {Object.values(providers).map((provider) => (
      <div key = {provider.name}>
        <button className="bg-[#18D860] text-white p-5 rounded-full"> 
          Login with {provider.name} 
        </button>
      </div>
    ))}

    </div>


  )
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers
    }
  }
}