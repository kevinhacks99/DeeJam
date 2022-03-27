import React from 'react'
import Post from './Post'
import {useEffect, useState} from "react"
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>  onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), 
    snapshot => {
      setPosts(snapshot.docs);
    }
    ),
    [db]);
    
return (
  <div>
      {posts.map((post) => (
          <Post 
          key = {post.id} 
          id={post.id}
          username = {post.data().username} 
          userImg = {post.data().profileImg} 
          caption = {post.data().caption}
          song = {post.data().song}
          artist = {post.data().artist}
          img = {post.data().songPic}
          />
      ))}
  </div>
);
}

export default Posts