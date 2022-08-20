
import { useEffect, useState } from 'react';
import './App.css';
import {db,auth} from './firebase';
import Post from './Post';
import { Modal, Button,Input } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
//import { Button } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}
const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([
    /* {
      username:"jasmine",
      caption:"Wow!! It works",
      imageUrl:"https://www.andreasreiterer.at/wp-content/uploads/2017/11/react-logo-825x510.jpg"
    }, */
  ]);
  const [open, setOpen] = useState(false);
  const [openSignin,setOpenSignin]=useState(false);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);

  //useEffect-runs a piece of code based on specific condition
  //runs everytime when the variable changes
  useEffect(()=>{
    auth.onAuthStateChanged(authuser=>{
      if(authuser){
        // user loggedin
        console.log(authuser);
        setUser(authuser);
        if(authuser.displayName)
        {
          //user already has a display name
        }
        else{
          return authuser.updateProfile({
            displayName:username
          })
        }
      }
      else{
        //user loggedout
      }
    });
  },[user,username]);

  useEffect(() => {
    //every time a new post is added this code fired
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        }
      )));
    })

  }, [])
  const signUp=(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authuser)=>{
      return authuser.user.updateProfile({
        displayName:username
      })
    })
    .catch(error=>alert(error.message))
    setOpen(false);
  };
  const signIn=(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error=>alert(error.message))
    setOpenSignin(false);
  }
  return (
    <div className="app">
            
      {/* SignUp form */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className='app_signup'>
          <center>
            <img
              className="app_headerImage"
              //src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
              alt="" />
          </center>
          <Input type='text' placeholder='Username' name='username' value={username}
            onChange={(e)=>setUsername(e.target.value)} />
          <Input type='email' placeholder='E-Mail' name='email' value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
          <Input type='password' placeholder='Password' name='password' value={password}
            onChange={(e)=>setPassword(e.target.value)}/>             
          <Button type="submit" onClick={signUp}>Sign Up</Button>
               
          </form>
          </div>
          
      </Modal>

      {/* SignIn Form */}
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className='app_signup'>
          <center>
            <img
              className="app_headerImage"
              //src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
              alt="" />
          </center>
          {/* <Input type='text' placeholder='Username' name='username' value={username}
            onChange={(e)=>setUsername(e.target.value)} /> */}
          <Input type='email' placeholder='E-Mail' name='email' value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
          <Input type='password' placeholder='Password' name='password' value={password}
            onChange={(e)=>setPassword(e.target.value)}/>             
          <Button type="submit" onClick={signIn}>Sign In</Button>
               
          </form>
          </div>
          
      </Modal>

      {/* Header */}
      <div className='app_header'>
        <img
          className="app_headerImage"
          //src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
          alt="" />

      {
        user?
        (<Button onClick={() => auth.signOut()}>Sign Out</Button>)
        :
        (
        <div className='app_loginContainer'>
        <Button onClick={() => setOpen(true)}>SIGN UP</Button>
        <Button onClick={() => setOpenSignin(true)}>SIGNIN</Button>
        </div>)

      }
      </div>
      <h1>Lets buid an instagram clone !!</h1>
      {/* posts */}
      {/* posts */}
      {
        posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption}
            imageUrl={post.imageUrl} dpUrl={post.dpUrl} />
        ))
      }
      {/* <Post username="Jasmine"  caption="Wow!! It works" 
        imageUrl="https://www.andreasreiterer.at/wp-content/uploads/2017/11/react-logo-825x510.jpg"/>
      <Post username="Jobin" caption="Dope"
         imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLkZRQhpK_yK0u_oSpBbkiR7aqDXhlvxG6Q&usqp=CAU"/>
      <Post username="Eric"  caption="Beauty of nature" 
         imageUrl="https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2019/10/Karthika-Gupta-Compelling-Nature-Photos-6.jpg?fit=1500%2C1000&ssl=1"/> */}
   {/*  Posts uploading */}
    {
        user?.displayName ?
        (<ImageUpload username={user.displayName}/>)
        :
        (<h3>Please Sign in or SignUp</h3>)
      }
    </div>
  );
}

export default App;
