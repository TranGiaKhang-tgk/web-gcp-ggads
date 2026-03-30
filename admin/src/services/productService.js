import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

// ➕ Thêm sản phẩm
export const addProduct = async (data) => {
  await addDoc(collection(db, "Products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// 📥 Lấy danh sách sản phẩm
export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "Products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✏️ Cập nhật sản phẩm
export const updateProduct = async (id, data) => {
  await updateDoc(doc(db, "Products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// 🗑️ Xoá sản phẩm
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "Products", id));
};
