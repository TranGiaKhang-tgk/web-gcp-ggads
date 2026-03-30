import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../style/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  // ==============================
  // 🔹 Danh mục chính (slug dùng cho URL)
  // ==============================
  const categories = [
    { name: "Điện thoại, Tablet", icon: "📱", slug: "phone-tablet" },
    { name: "Laptop", icon: "💻", slug: "laptop" },
    { name: "Âm thanh", icon: "🎧", slug: "audio" },
    { name: "Đồng hồ", icon: "⌚", slug: "watch" },
    { name: "Phụ kiện", icon: "🔌", slug: "accessories" },
    { name: "Tivi", icon: "📺", slug: "tv-appliance" },
    { name: "Hàng cũ", icon: "📦", slug: "used-goods" },
    { name: "Khuyến mãi", icon: "🏷️", slug: "promotion" },
  ];

  // ==============================
  // 🔹 Lấy sản phẩm nổi bật (random 4)
  // ==============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const randomProducts = allProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 12);

        setProducts(randomProducts);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>BERRYGOLD - An tâm mua sắm</title>
      </Helmet>

      <div className="home-page py-4">
        <Container fluid="lg">
          <Row>
            {/* ================= CỘT TRÁI: DANH MỤC ================= */}
            <Col md={3} lg={2} className="mb-4 mb-md-0">
              <div className="category-sidebar p-3 shadow-sm bg-white rounded">
                <h6 className="fw-bold text-danger text-uppercase mb-3">
                  Danh mục sản phẩm
                </h6>

                <ul className="list-unstyled m-0">
                  {categories.map((cat) => (
                    <li key={cat.slug} className="mb-2">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="category-link d-flex align-items-center text-decoration-none"
                      >
                        <span className="me-2 fs-5">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* ================= CỘT PHẢI ================= */}
            <Col md={9} lg={10}>
              {/* ================= Banner ================= */}
              <div className="main-banner mb-4 rounded-4 overflow-hidden shadow-sm">
                <div className="banner-overlay">
                  <div className="banner-text text-white">
                    <h2 className="fw-bold mb-2">
                      Kiến tạo tương lai số cùng{" "}
                      <span className="berrygold-brand">BERRYGOLD</span>
                    </h2>
                    <p className="mb-4">
                      Mang công nghệ thế giới đến gần hơn với người Việt.
                    </p>
                    <Button
                      variant="light"
                      as={Link}
                      to="/category/phone-tablet"
                      className="fw-semibold px-4 py-2"
                    >
                      Khám phá ngay
                    </Button>
                  </div>
                </div>
              </div>

              {/* ================= SẢN PHẨM NỔI BẬT ================= */}
              <h5 className="fw-bold text-uppercase text-danger mb-3">
                Sản phẩm nổi bật
              </h5>

              <Row className="g-3">
                {products.map((p) => (
                  <Col key={p.id} xs={6} md={4} lg={3}>
                    <Link
                      to={`/product/${p.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <Card className="product-card shadow-sm border-0 h-100">
                        <div className="product-img-wrapper">
                          <img
                            src={p.images?.[0] || "/images/noimage.jpg"}
                            alt={p.name}
                            className="img-fluid"
                          />
                        </div>
                        <Card.Body className="text-center">
                          <Card.Title className="product-name">
                            {p.name}
                          </Card.Title>
                          <p className="product-price text-danger fw-bold mb-0">
                            {p.price?.toLocaleString("vi-VN")}₫
                          </p>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
