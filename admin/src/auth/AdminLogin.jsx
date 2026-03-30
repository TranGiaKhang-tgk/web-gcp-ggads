import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast";
import "../Style/Auth.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  Đăng nhập bằng Firebase Auth
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const docRef = doc(db, "Users", res.user.uid);
      const docSnap = await getDoc(docRef);

      //  Kiểm tra quyền admin
      if (docSnap.exists() && docSnap.data().role === "Admin") {
        const adminData = { uid: res.user.uid, ...docSnap.data() };

        //  Cập nhật trạng thái online trong Firestore
        await updateDoc(docRef, { isOnline: true });

        //  Lưu vào localStorage qua context
        login(adminData);

        toast.success("Đăng nhập thành công!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Tài khoản này không có quyền quản trị!");
      }
    } catch (err) {
      console.error(" Login error:", err);
      toast.error("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Đăng nhập quản trị</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email công ty"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
          />
          <button type="submit">Đăng nhập</button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
