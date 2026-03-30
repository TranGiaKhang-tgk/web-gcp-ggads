import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANpku-KNyK1EeZGm0cGuhRdMuBKWODM9",
  authDomain: "tttn2026-163fc.firebaseapp.com",
  projectId: "tttn2026-163fc",
  storageBucket: "tttn2026-163fc.appspot.com", // FIX
  messagingSenderId: "136275542890",
  appId: "1:136275542890:web:94272e92645c41c6671b13"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
