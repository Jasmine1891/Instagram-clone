import React, { useEffect, useState } from 'react'
import './post.css';
import {db} from './firebase';
import Avatar from '@mui/material/Avatar';

// or
//import { Avatar } from '@mui/material';
import firebase from "firebase/compat/app";
function Post({postId,username,user,caption,imageUrl,dpUrl}) {
    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState('');
    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db.collection('posts')
            .doc(postId).collection('comments')
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }
        return()=>{
            unsubscribe();
        }
    },[postId])
    const postComment=(e)=>{
        e.preventDefault();
        db.collection('posts').doc(postId)
        .collection('comments')
        .add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')

    }
    return (
        <div className='post'>

            {/* header-> avatar+username */}
            <div className='post_header'>
                <Avatar className='post_avatar'
                    alt="jasmine"
                    // src="https://png.pngtree.com/element_our/png/20181206/female-avatar-vector-icon-png_262142.jpg"/>
                    src={dpUrl} />
                <h3>{username}</h3>
            </div>


            {/* Image */}
            <img className='post_image'
                src={imageUrl}
                alt='' />

            {/*  username+caption */}
            <h4 className='post_text'><strong>{username}</strong>{caption}</h4>
            <div className='post_comments'>
                {
                    comments.map((comment) => (
                            
                        <p>
    
                            <strong>{comment.username} </strong>{comment.text}
                        </p>
                    ))
                }
            </div>
            {/* CommentBox appears when user is loggedin */}
            {user && (
            <form className='post_commentBox'>
                <input className='post_input' placeholder='Add Comments...'
                value={comment} onChange={(e)=>setComment(e.target.value)}/>
                <button className='post_button'
                disabled={!comment}
                onClick={postComment}>Post</button>
            </form>
            )}
        </div>
    )
}

export default Post;