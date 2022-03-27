import React from 'react'


function SearchDropDown ({list}) {
  return (
    <div mt-4 ml-10>
      {list.map(songs =>(
        <div key = {songs.id} className="flex items-center justify-between mt-3 ">
          <img className='w-10 h-10 rounded-full border p-[2px]' src={songs.album.images[0].url}  alt ="" />
          <div className ="flex-1 ml-4">
                    <h2 className="font-semibold text-sm"> {songs.name} </h2>  
                    <h3 className= "text-xs text-gray-400"> by {songs.artists[0].name} </h3>   
                </div>
        </div>
      ))}

    </div>
  )
}

export default SearchDropDown