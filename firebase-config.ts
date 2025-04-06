


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Подключаем сервис для авторизации
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmEJfWrfb28yFy8solIlPT2vp6g2Nu3Ak",
    authDomain: "db-project-f7912.firebaseapp.com",
    projectId: "db-project-f7912",
    storageBucket: "db-project-f7912.firebasestorage.app",
    messagingSenderId: "1018623342874",
    appId: "1:1018623342874:web:e257b55f4c7fbedaa8d4a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Здесь ты инициализируешь auth для работы с авторизацией
export { auth };