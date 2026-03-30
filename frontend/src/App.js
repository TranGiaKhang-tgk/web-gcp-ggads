import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ❗ SỬA Ở ĐÂY
import CompareSelect from "./components/CompareSelect";
import Compare from "./components/Compare";

import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/cartContext";
import { CompareProvider } from "./context/CompareContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBox from "./components/ChatBox";
import AuthModal from "./auth/AuthModal";

// ==== PAGES ====
import Home from "./pages/Home";
import TrackOrder from "./pages/TrackOrder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ThankYou from "./pages/ThankYou";
import CompareSidebar from "./pages/CompareSidebar";

// ==== PRODUCT & CATEGORY ====
import ProductDetail from "./product/ProductDetail";
import CategoryPage from "./pages/CategoryPage";

// ==== POLICY ====
import DeliveryPolicy from "./policy/deliveryPolicy";
import RefundPolicy from "./policy/refundPolicy";
import About from "./policy/About";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  return (
    <CompareProvider>
      <CartProvider>
        <UserProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">

              {/* HEADER */}
              <Header
                onLoginClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
              />

              {/* AUTH MODAL */}
              {showAuthModal && (
                <AuthModal
                  mode={authMode}
                  onClose={() => setShowAuthModal(false)}
                  switchMode={setAuthMode}
                />
              )}

              {/* MAIN */}
              <main className="flex-grow-1">
                <Routes>

                  <Route path="/" element={<Home />} />

                  {/* COMPARE */}
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/compare/select" element={<CompareSelect />} />
                  <Route path="/compare/sidebar" element={<CompareSidebar />} />

                  {/* CART - ORDER */}
                  <Route path="/pages/cart" element={<Cart />} />
                  <Route path="/pages/checkout" element={<Checkout />} />
                  <Route path="/thankyou" element={<ThankYou />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/pages/trackorder" element={<TrackOrder />} />

                  {/* CATEGORY & PRODUCT */}
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* SEARCH & PROFILE */}
                  <Route path="/search" element={<Search />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* POLICY */}
                  <Route path="/policy/deliverypolicy" element={<DeliveryPolicy />} />
                  <Route path="/policy/refundpolicy" element={<RefundPolicy />} />
                  <Route path="/policy/about" element={<About />} />

                </Routes>
              </main>

              {/* FOOTER */}
              <Footer />

              {/* CHAT */}
              <ChatBox />

            </div>
          </Router>

          <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        </UserProvider>
      </CartProvider>
    </CompareProvider>
  );
}

export default App;