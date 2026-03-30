import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
} from "firebase/auth";
import {
doc,
updateDoc,
setDoc,
serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LoginForm({ switchMode, onClose }) {
const [account, setAccount] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

const navigate = useNavigate();

// ===============================
// 🔐 LOGIN EMAIL / PASSWORD
// ===============================
const handleLogin = async () => {
if (!account || !password) {
setError("Vui lòng điền đầy đủ thông tin");
setSuccess(false);
return;
}


try {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    account,
    password
  );

  const user = userCredential.user;

  await updateDoc(doc(db, "users", user.uid), {
    lastLogin: serverTimestamp(),
    isOnline: true,
  });

  setError("");
  setSuccess(true);

  setTimeout(() => {
    onClose();
    navigate("/");
  }, 1200);
} catch (err) {
  if (err.code === "auth/user-not-found") {
    setError("Tài khoản chưa được đăng ký");
  } else if (err.code === "auth/wrong-password") {
    setError("Mật khẩu không đúng");
  } else if (err.code === "auth/invalid-email") {
    setError("Email không hợp lệ");
  } else {
    setError("Đăng nhập thất bại, vui lòng thử lại");
  }
  setSuccess(false);
}


};

// ===============================
// 🔵 LOGIN GOOGLE
// ===============================
const handleGoogleLogin = async () => {
try {
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const user = result.user;


  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      role: "user",
      isOnline: true,
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  setError("");
  setSuccess(true);

  setTimeout(() => {
    onClose();
    navigate("/");
  }, 1000);
} catch (err) {
  console.error(err);
  setError("Đăng nhập Google thất bại");
  setSuccess(false);
}


};

return ( <form className="auth-form"> <h2 className="auth-title">Đăng nhập</h2>

  <div className="form-group">
    <input
      type="email"
      name="username"
      autoComplete="username"
      placeholder="Email"
      value={account}
      onChange={(e) => setAccount(e.target.value)}
    />
  </div>

  <div className="form-group">
    <input
      type="password"
      name="current-password"
      autoComplete="current-password"
      placeholder="Mật khẩu"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  {/* 🔑 QUÊN MẬT KHẨU */}
  <div
    className="auth-forgot"
    onClick={() => switchMode("forget")}
    style={{
      textAlign: "right",
      fontSize: 14,
      color: "#0a58ca",
      cursor: "pointer",
      marginBottom: 12,
    }}
  >
    Quên mật khẩu?
  </div>

  {error && (
    <div
      style={{
        color: "#d70018",
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
      }}
    >
      {error}
    </div>
  )}

  {success && (
    <div
      style={{
        color: "#2e7d32",
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
      }}
    >
      🎉 Bạn đã đăng nhập thành công!
    </div>
  )}

  <button
    type="button"
    className="auth-btn primary"
    onClick={handleLogin}
    disabled={success}
    style={{ opacity: success ? 0.7 : 1 }}
  >
    Đăng nhập
  </button>

  <div className="auth-divider">
    <span>Hoặc đăng nhập bằng</span>
  </div>

  <button
    type="button"
    className="auth-google"
    onClick={handleGoogleLogin}
    disabled={success}
  >
    🔵 Đăng nhập với Google
  </button>

  <div className="auth-switch">
    Chưa có tài khoản?{" "}
    <span onClick={() => switchMode("register")}>
      Đăng ký ngay
    </span>
  </div>
</form>

);
}
