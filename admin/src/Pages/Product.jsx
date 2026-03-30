import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../Style/Product.css";

import AddProduct from "../Components/AddProduct";
import {
  getProducts,
  deleteProduct,
} from "../services/productService";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📥 Load sản phẩm từ Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🗑️ Xoá
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;

    try {
      await deleteProduct(id);
      toast.success("Đã xoá sản phẩm");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Xoá thất bại");
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h3>Quản lý sản phẩm</h3>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : products.length === 0 ? (
        <p>Chưa có sản phẩm nào</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{Number(p.price).toLocaleString()} ₫</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️ Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL ADD / EDIT */}
      {showForm && (
        <div className="addproduct-backdrop" onClick={() => setShowForm(false)}>
          <div
            className="addproduct-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <AddProduct
              product={editingProduct}
              onClose={() => {
                setShowForm(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
