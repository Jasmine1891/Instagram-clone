import React, { useState } from 'react';
import { Button,Input } from '@mui/material';
import {db,storage} from './firebase';
import firebase from "firebase/compat/app";
import './imageUpload.css'
function ImageUpload({username}) {
    const [caption,setCaption]=useState('');
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed',(snapshot)=>{
            //progressfunction
            const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(progress);
        },(error)=>{
            console.log(error);
            alert(error.message);
        },()=>{
                //complete function
                storage.ref('images').child(image.name).getDownloadURL()
                .then(url=>{
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username,
                        dpUrl:url
                   })
                   setProgress(0);
                   setCaption('');
                   setImage(null);
                })

            }
        )
    }
  return (
    <div className='imageUpload'>
        <progress className='imageUpload_progress' value={progress} max="100"/>
        <Input type="text" placeholder='Enter Caption...'
        onChange={(e)=>setCaption(e.target.value)} value={caption}/>
        <Input type='file' onChange={handleChange}/>
        <Button onClick={handleUpload}>Upload</Button>

    </div>
  )
}

export default ImageUpload