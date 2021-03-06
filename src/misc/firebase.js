import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyCTmadS07XvEktPYpBGthRApdgW0QKcnl4",
    authDomain: "chat-app-1273a.firebaseapp.com",
    databaseURL: "https://chat-app-1273a-default-rtdb.firebaseio.com",
    projectId: "chat-app-1273a",
    storageBucket: "chat-app-1273a.appspot.com",
    messagingSenderId: "394221908666",
    appId: "1:394221908666:web:06cd1c94b35946bd284883"
};
  
const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();