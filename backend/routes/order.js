import express from "express";
import { db } from "../config/firebase.js";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const router = express.Router();

///TẠO ĐƠN HÀNG (checkout)
router.post("/", async (req, res) => {
  try {
    const {
      userID,
      role,
      fullname,
      phone,
      email,
      address,
      province,
      commune,
      note,
      payment,
      items,
      total,
      orderId,
      status,
      paymentStatus,
      createdAt,
      isGuest,
    } = req.body;

    if (!fullname || !phone || !address || !province || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng." });
    }

    const newOrder = {
      userID: userID || null,
      role: role || (isGuest ? "Guest" : "Customer"),
      fullname,
      phone,
      email: email || "",
      address,
      province,
      commune,
      note: note || "",
      payment: payment || "cod",
      paymentStatus: paymentStatus || "Chưa thanh toán",
      items,
      total,
      orderId,
      status: status || "Chờ xử lý",
      createdAt: createdAt || new Date().toISOString(),
      isGuest: !!isGuest,
    };

    const docRef = await addDoc(collection(db, "Orders"), newOrder);

    res.status(201).json({
      message: "Tạo đơn hàng thành công!",
      id: docRef.id,
      ...newOrder,
    });
  } catch (err) {
    console.error(" Lỗi khi lưu đơn hàng:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LẤY TẤT CẢ ĐƠN HÀNG (cho admin)
router.get("/", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "Orders"));
    const orders = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    res.status(200).json(orders);
  } catch (err) {
    console.error(" Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Thiếu trạng thái mới." });
    }

    const ref = doc(db, "Orders", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const data = snap.data();
    const updateData = { status };

    // Nếu trạng thái là "Hoàn thành" → cập nhật luôn thanh toán
    if (status === "Hoàn thành") {
      updateData.paymentStatus = "Đã thanh toán"; // Thanh toán hoàn tất
      updateData.shipping = {
        ...(data.shipping || {}),
        currentStatus: "delivered",
        deliveredAt: new Date().toISOString(),
      };
    }

    // Nếu trạng thái là "Đang giao" → cập nhật shipping đang vận chuyển
    if (status === "Đang giao") {
      updateData.shipping = {
        ...(data.shipping || {}),
        currentStatus: "in_transit",
      };
    }

    // Nếu trạng thái là "Đã hủy" → reset thanh toán
    if (status === "Đã hủy") {
      updateData.paymentStatus = "Chưa thanh toán";
    }

    await updateDoc(ref, updateData);

    res.json({
      message: "Cập nhật trạng thái thành công!",
      updateData,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// XÓA ĐƠN HÀNG
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "Orders", id));
    res.json({ message: "Đã xóa đơn hàng thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa đơn hàng:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// TẠO ĐƠN VỊ VẬN CHUYỂN CHO ĐƠN HÀNG
router.patch("/:id/shipping", async (req, res) => {
  try {
    const { id } = req.params;
    const { carrier } = req.body;

    const ref = doc(db, "Orders", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const randomPrefix = ["GHN", "GHTK", "VNPOST"];
    const prefix = carrier || randomPrefix[Math.floor(Math.random() * randomPrefix.length)];
    const trackingCode = `${prefix}${Math.floor(100000000 + Math.random() * 900000000)}`;

    await updateDoc(ref, {
      status: "Đang giao",
      shipping: {
        carrier:
          prefix === "GHN"
            ? "Giao Hàng Nhanh"
            : prefix === "GHTK"
            ? "Giao Hàng Tiết Kiệm"
            : "VNPost",
        trackingCode,
        currentStatus: "picked_up",
        createdAt: new Date().toISOString(),
      },
    });

    res.json({
      message: " Đã tạo đơn vận chuyển thành công!",
      trackingCode,
      status: "Đang giao",
    });
  } catch (err) {
    console.error("Lỗi khi tạo đơn vận chuyển:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
