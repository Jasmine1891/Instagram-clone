// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
const firebaseApp=firebase.initializeApp(
    {
        apiKey: "AIzaSyAWqTATqH5IQE0dhzn2stBGN4alYXisbbY",
        authDomain: "instagam-clone-react-f5af2.firebaseapp.com",
        databaseURL: "https://instagam-clone-react-f5af2-default-rtdb.firebaseio.com",
        projectId: "instagam-clone-react-f5af2",
        storageBucket: "instagam-clone-react-f5af2.appspot.com",
        messagingSenderId: "744372541752",
        appId: "1:744372541752:web:645dce0a917fc1b95c09cd",
        measurementId: "G-7EY33LGV48"
      });
const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();
export {db,auth,storage};
export default firebase;
