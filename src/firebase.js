
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAulSmbQdZ4_l8W298979vy83g6pXtMGMI",
  authDomain: "project-manager-react-a607e.firebaseapp.com",
  projectId: "project-manager-react-a607e",
  storageBucket: "project-manager-react-a607e.firebasestorage.app",
  messagingSenderId: "697534445993",
  appId: "1:697534445993:web:b4a721cd772e928424ecb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
