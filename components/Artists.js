import React from 'react'

function Artists({albumCover, artistName}) {
  return (
    <div>
        <img className="h-14 w-14 rounded-full p-[1.5px] 
        border-green-600 border-2 object-contain cursor-pointer 
        hover:scale-110 transition transform duration-200 ease-out" src={albumCover} alt="" />
        <p className = "text-xs w-14 truncate text-center">  {artistName} </p>
    </div>
  )
}

export default Artists