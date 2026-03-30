import express from "express";
import { db } from "../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const msg = req.body.message?.toLowerCase() || "";

    let reply = "Xin lỗi tôi chưa tìm thấy sản phẩm phù hợp";

    const snapshot = await getDocs(collection(db, "Products"));

    let list = [];

    snapshot.forEach(doc => {
      const p = doc.data();

      // 🔥 tìm theo tên sản phẩm (rất quan trọng)
      if (p.name && p.name.toLowerCase().includes(msg)) {
        list.push(`📱 ${p.name} - ${p.price}đ`);
      }
    });

    // nếu tìm được
    if (list.length > 0) {
      reply = "Kết quả tìm kiếm:\n\n" + list.slice(0,5).join("\n");
    }

    // fallback
    else if (msg.includes("ship")) {
      reply = "Phí ship khoảng 20k - 30k";
    }

    else if (msg.includes("chào")) {
      reply = "Xin chào! Bạn muốn tìm sản phẩm gì?";
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Bot đang lỗi!" });
  }

});

export default router;