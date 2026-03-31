import { initializeApp } from "Firebase/app";
import { getFirestore } from "Firebase/firestore";
import { getStorage } from "Firebase/storage";

// ⚠️ Nên dùng biến môi trường khi deploy (an toàn hơn)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyANpku-KNyK1EeZGm0cGuhRdMuBKWODM9",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "tttn2026-163fc.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "tttn2026-163fc",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tttn2026-163fc.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "136275542890",
  appId: process.env.FIREBASE_APP_ID || "1:136275542890:web:94272e92645c41c6671b13"
};

// Khởi tạo app
const app = initializeApp(firebaseConfig);

// Database + Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export
export { db, storage };
