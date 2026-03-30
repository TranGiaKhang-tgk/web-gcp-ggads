import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RegisterForm({ switchMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone,
        role: "user",
        createdAt: new Date(),
      });

      setError("");
      setSuccess(true);

      setTimeout(() => {
        switchMode("login");
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" autoComplete="on">
      <h2 className="auth-title">Đăng ký</h2>

      <div className="form-group">
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ color: "#d70018", fontSize: 14, marginBottom: 12, textAlign: "center" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: "#2e7d32", fontSize: 14, marginBottom: 12, textAlign: "center" }}>
          🎉 Bạn đã đăng ký thành công!
        </div>
      )}

      <button
        type="button"
        className="auth-btn primary"
        onClick={handleRegister}
        disabled={success}
        style={{ opacity: success ? 0.7 : 1 }}
      >
        Hoàn tất đăng ký
      </button>

      <div className="auth-switch">
        <span onClick={() => switchMode("login")}>
          ← Quay lại đăng nhập
        </span>
      </div>
    </form>
  );
}
