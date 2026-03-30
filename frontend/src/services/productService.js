import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

// ==============================
// 🔹 Upload 1 ảnh → trả về URL
// ==============================
const uploadImage = async (file) => {
  const imageRef = ref(
    storage,
    `products/${Date.now()}-${file.name}`
  );
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

// ==============================
// 🔹 MAP slug (URL) → category trong DB
// ==============================
const CATEGORY_MAP = {
  "phone-tablet": "Điện thoại,tablet",
  "laptop": "Laptop",
  "audio": "Âm thanh",
  "watch": "Đồng hồ",
  "accessories": "Phụ kiện",
  "tv-appliance": "Tivi",
  "used-goods": "Hàng cũ",
  "promotion": "Khuyến mãi",
};

// ==============================
// 🔹 Thêm sản phẩm (GIỮ category như DB)
// ==============================
export const addProduct = async (data) => {
  const imageUrls = [];

  for (const img of data.images) {
    if (img.file) {
      const url = await uploadImage(img.file);
      imageUrls.push(url);
    }
  }

  await addDoc(collection(db, "Products"), {
    name: data.name,
    category: CATEGORY_MAP[data.category] || data.category, // 🔥 KHỚP DB
    price: Number(data.price),
    description: data.description || "",
    color: data.color || "",
    material: data.material || "",
    size: data.size || "",
    images: imageUrls,
    createdAt: serverTimestamp(),
  });
};

// =======================================
// 🔹 Lấy sản phẩm theo danh mục (KHỚP DB)
// =======================================
export const getProductsByCategory = async (slug) => {
  const categoryName = CATEGORY_MAP[slug];

  if (!categoryName) return [];

  const q = query(
    collection(db, "Products"),
    where("category", "==", categoryName)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ==============================
// 🔹 Lấy tất cả sản phẩm
// ==============================
export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, "Products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
