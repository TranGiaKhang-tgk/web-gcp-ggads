import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import chatRoutes from "./routes/chat.js";

// Firebase
import { db } from "./config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const app = express();

// ===== Fix __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ===== API ROUTES =====
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

// ===== TEST ROUTE =====
app.get("/api/test", (req, res) => res.send("API OK 🚀"));

// ===== ROOT ROUTE (QUAN TRỌNG - FIX CLOUD RUN) =====
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/*
❌ TẠM TẮT FRONTEND (tránh crash trên Cloud Run)
app.use(express.static(path.join(__dirname, "build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
*/

// ===== TEST FIREBASE =====
const testFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    console.log(`Firebase connected. Products count: ${querySnapshot.size}`);
  } catch (err) {
    console.error("Firebase connection error:", err.message);
  }
};

// ===== PORT (CHUẨN CLOUD RUN) =====
const PORT = process.env.PORT || 8080;

// ===== START SERVER =====
app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await testFirebase();
});
