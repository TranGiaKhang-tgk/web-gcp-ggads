import React, { useState, useEffect, useRef } from "react";
import "../Style/Header.css";
import { useAdmin } from "../context/AdminContext";
import { db} from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef(null);

  // ✅ Tự đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (admin?.uid) {
      await updateDoc(doc(db, "Users", admin.uid), { isOnline: false }); 
    }
    logout();
    window.location.href = "/login";  
  };

  return (
    <>
      <header className="admin-header">
        {/* LEFT */}
        <div className="header-left">
          <h3 className="logo">
            BERRYGOLD <span>ADMIN</span>
          </h3>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-box"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="header-right">
          <button className="notif-btn" title="Thông báo">
            🔔
          </button>

          <div
            className="admin-profile"
            ref={menuRef}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="admin-text">
              <span className="admin-name">{admin?.fullname || "Admin"}</span>
              <small className="admin-role">Quản trị viên</small>
            </div>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setShowConfirm(true)}>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/*  MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h4>Đăng xuất tài khoản</h4>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
            <div className="modal-actions">
              <button className="yes-btn" onClick={handleLogout}>
                Có
              </button>
              <button className="no-btn" onClick={() => setShowConfirm(false)}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
