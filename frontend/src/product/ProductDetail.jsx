  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { Container, Row, Col, Button, Form } from "react-bootstrap";
  import axios from "axios";
  import "../style/ProductDetail.css";
  import { addToCart } from "../utils/cartUtils";
  import { useCart } from "../context/cartContext";
  import toast from "react-hot-toast";
  import Product360 from "../components/Product360";

  export default function ProductDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);

    const { refreshCartCount } = useCart();

    const show = (v) => (v && v.toString().trim() !== "" ? v : "Chưa cập nhật");

    // ===== LOAD PRODUCT =====
    useEffect(() => {

      const fetchProduct = async () => {

        try {

          const res = await axios.get(
            `http://localhost:5000/api/products/${id}`
          );

          setProduct(res.data);

          if (res.data.images?.length > 0) {
            setMainImage(res.data.images[0]);
          }

        } catch (err) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        }

      };

      fetchProduct();

    }, [id]);

    // ===== CLICK ẢNH =====
    const handleThumbClick = (img) => {
      setMainImage(img);
    };

    // ===== ADD TO CART =====
    const handleAddToCart = () => {

      addToCart(product, quantity);

      refreshCartCount();

      toast.success("🛒 Đã thêm vào giỏ hàng!");

    };

    // ===== BUY NOW =====
    const handleBuyNow = () => {

      if (!product) return;

      const buyNowItem = [{
        ...product,
        quantity: parseInt(quantity)
      }];

      localStorage.setItem(
        "checkout_cart",
        JSON.stringify(buyNowItem)
      );

      navigate("/pages/checkout");

    };

    if (!product)
      return (
        <p className="text-center text-muted py-5">
          Đang tải chi tiết...
        </p>
      );

    return (

      <div className="product-detail py-4">

        <Container>

          <Row className="g-4">

            {/* ===== IMAGE + 360 ===== */}

            <Col md={6}>

              <div className="product-gallery">

                <img
                  src={mainImage || "/images/no-image.png"}
                  alt={show(product.name)}
                  className="main-img img-fluid rounded"
                />

                <div className="thumb-list d-flex mt-3 gap-2 flex-wrap">

                  {product.images?.length > 0 ? (

                    product.images.map((img, i) => (

                      <img
                        key={i}
                        src={img}
                        alt={`Ảnh ${i + 1}`}
                        onClick={() => handleThumbClick(img)}
                        className={`thumb-item ${
                          mainImage === img ? "active" : ""
                        }`}
                      />

                    ))

                  ) : (

                    <div className="thumb-placeholder">
                      Chưa có ảnh
                    </div>

                  )}

                </div>

                {/* ===== 360 VIEW ===== */}

                <div className="mt-4">

                  <h6 className="fw-bold">
                    Xem sản phẩm 360°
                  </h6>

                  <Product360 src="/videos/ip17maxcam.mp4" />

                </div>

              </div>

            </Col>

            {/* ===== PRODUCT INFO ===== */}

            <Col md={6}>

              <div className="product-info">

                <h4 className="product-title">
                  {show(product.name)}
                </h4>

                <div className="rating-line mb-2">

                  <span className="stars">★★★★★</span>

                  <span className="text-muted small ms-2">
                    ({product.reviews || "Chưa có đánh giá"})
                  </span>

                </div>

                <div className="price-line">

                  {product.price ? (

                    <span className="price">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>

                  ) : (

                    <span className="price text-muted">
                      Chưa cập nhật
                    </span>

                  )}

                </div>

                <ul className="product-meta mt-3">

                  <li>
                    <strong>Mã sản phẩm:</strong> {show(product.id)}
                  </li>

                  <li>
                    <strong>Tình trạng:</strong>{" "}
                    {show(product.status || "Còn hàng")}
                  </li>

                  <li>
                    <strong>Danh mục:</strong> {show(product.category)}
                  </li>

                </ul>

                <div className="product-attrs mt-3">

                  <p>
                    <strong>Màu sắc:</strong> {show(product.color)}
                  </p>

                  <p>
                    <strong>Chất liệu:</strong> {show(product.material)}
                  </p>

                  <p>
                    <strong>Kích thước:</strong> {show(product.size)}
                  </p>

                </div>

                {/* ===== QUANTITY ===== */}

                <div className="d-flex align-items-center mt-3">

                  <span className="me-2 fw-semibold">
                    Số lượng:
                  </span>

                  <Form.Control
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value)
                    }
                    style={{ width: "90px" }}
                  />

                </div>

                {/* ===== BUTTON ===== */}

                <div className="mt-4 d-flex gap-3">

                  <Button
                    variant="danger"
                    className="btn-cart flex-fill"
                    onClick={handleAddToCart}
                  >
                    🛒 Thêm vào giỏ
                  </Button>

                  <Button
                    variant="success"
                    className="btn-buy flex-fill"
                    onClick={handleBuyNow}
                  >
                    ⚡ Mua ngay
                  </Button>

                </div>

                <div className="delivery-info mt-4">

                  <p>
                    🚚 Giao hàng tận nơi – Kiểm tra hàng trước khi thanh toán
                  </p>

                  <p>
                    💳 Hỗ trợ thanh toán chuyển khoản / COD toàn quốc
                  </p>

                </div>

              </div>

            </Col>

          </Row>

          {/* ===== DESCRIPTION ===== */}

          <Row className="mt-5">

            <Col md={8}>

              <div className="product-desc">

                <h5>Mô tả sản phẩm</h5>

                <p>
                  {show(
                    product.description ||
                    "Thông tin chi tiết sản phẩm đang được cập nhật."
                  )}
                </p>

              </div>

            </Col>

            <Col md={4}>

              <div className="product-policy">

                <h6>Chính sách & Hỗ trợ</h6>

                <ul>
                  <li>✅ Giao hàng toàn quốc</li>
                  <li>✅ Đổi trả trong 7 ngày nếu lỗi sản phẩm</li>
                  <li>✅ Sản phẩm chất lượng chính hãng</li>
                  <li>✅ Tư vấn nhiệt tình</li>
                </ul>

              </div>

            </Col>

          </Row>

        </Container>

      </div>

    );

  }