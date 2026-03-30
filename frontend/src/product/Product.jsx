import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "../style/Product.css";

export default function Products() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

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

const slugMap = {
  "Điện thoại, Tablet": "phone-tablet",
  "Laptop": "laptop",
  "Âm thanh": "audio",
  "Đồng hồ": "watch",
  "Phụ kiện": "accessories",
  "Tivi, Điện máy": "tv-appliance",
  "Hàng cũ": "used-goods",
  "Khuyến mãi": "promotion",
};

  const currentCategory =
    categories.find((c) => c.slug === slug)?.name || "Danh mục sản phẩm";

  //  Lấy danh sách sản phẩm - backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data;

        const filtered = slug
          ? allProducts.filter((p) => slugMap[p.category] === slug)
          : allProducts;

        setProducts(filtered);
        setDisplayed(filtered);
      } catch (err) {
        console.error(" Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  //  Xử lý sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);

    let sorted = [...products];
    if (value === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (value === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (value === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (value === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));

    setDisplayed(sorted);
  };

  return (
    <div className="product-page container py-3">
      <Helmet>
        <title>{currentCategory} - WeHome</title>
      </Helmet>

      <div className="row">
        {/* ==== SIDEBAR ==== */}
        <div className="col-md-3 col-lg-2 mb-4 mb-md-0">
          <div className="category-sidebar p-3">
            <h6 className="fw-bold text-uppercase mb-3">Danh mục sản phẩm</h6>
            <ul className="list-unstyled m-0">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`category-link ${slug === cat.slug ? "active" : ""}`}
                  >
                    <span className="me-2">{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="col-md-9 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-danger text-uppercase mb-0">
              {currentCategory}
            </h5>

            {/*  Bộ lọc sắp xếp */}
            <select
              name="sort"
              value={sort}
              onChange={handleSortChange}
              className="form-select w-auto"
            >
              <option value="">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="name-desc">Tên Z → A</option>
            </select>
          </div>

          {loading ? (
            <p className="text-center text-muted py-5">Đang tải sản phẩm...</p>
          ) : displayed.length > 0 ? (
            <div className="category-grid">
              {displayed.map((p) => (
                <Link
                  key={p._id || p.id}
                  to={`/product/${p._id || p.id}`}
                  className="product-card-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      <img
                        src={p.images?.[0] || "/images/no-image.png"}
                        alt={p.name}
                        onError={(e) => (e.target.src = "/images/no-image.png")}
                      />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-price text-danger fw-bold">
                        {p.price?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-5">
              Không có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
