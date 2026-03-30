import "./auth.css";
import AuthChoice from "./AuthChoice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgetPassword from "./ForgetPassword";

export default function AuthModal({ mode, onClose, switchMode }) {
return ( <div className="auth-overlay" onClick={onClose}>
<div
className="auth-modal"
onClick={(e) => e.stopPropagation()}
> <button className="auth-close" onClick={onClose}>✕</button>


    {/* ===== LEFT: BERRY GOLD INFO ===== */}
    <div className="auth-left">
      <h3 className="berrygold-title">BERRY GOLD</h3>

      <div className="berrygold-mascot">
        <img
          src="/images/mascot.png"
          alt="Berry Gold Mascot"
        />
      </div>

      <ul className="berrygold-benefits">
        <li>🎁 Ưu đãi độc quyền cho thành viên</li>
        <li>🚚 Miễn phí giao hàng đơn từ 500K</li>
        <li>🎂 Voucher sinh nhật hấp dẫn</li>
        <li>💳 Thanh toán nhanh & tiện lợi</li>
      </ul>
    </div>

    {/* ===== RIGHT: FORM ===== */}
    <div className="auth-right">

      {mode === "choice" && (
        <AuthChoice switchMode={switchMode} />
      )}

      {mode === "login" && (
        <LoginForm
          switchMode={switchMode}
          onClose={onClose}
        />
      )}

      {mode === "register" && (
        <RegisterForm switchMode={switchMode} />
      )}

      {mode === "forget" && (
        <ForgetPassword switchMode={switchMode} />
      )}

    </div>
  </div>
</div>

);
}
