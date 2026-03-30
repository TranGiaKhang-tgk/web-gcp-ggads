import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../Style/AddProduct.css";

// ✅ IMPORT SERVICE
import { addProduct, updateProduct } from "../services/productService";

const AddProduct = ({ onClose, product }) => {
  const isEdit = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Danh mục
  const categories = {
    "Điện thoại, Tablet": "phone-tablet",
    "Laptop": "laptop",
    "Âm thanh": "audio",
    "Đồng hồ": "watch",
    "Phụ kiện": "accessories",
    "Tivi": "tv-appliance",
    "Hàng cũ": "used-goods",
    "Khuyến mãi": "promotion",
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    description: "",
    color: "",
    material: "",
    size: "",
    images: [],
  });

  // ✅ Khi edit
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        id: product.id || "",
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        description: product.description || "",
        color: product.color || "",
        material: product.material || "",
        size: product.size || "",
        images: product.images || [],
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({ ...prev, images: fileData }));
  };

  // ✅ SUBMIT → FIRESTORE
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    // ❗ LOẠI BỎ images TRƯỚC KHI LƯU FIRESTORE
    const { images, ...dataWithoutImages } = formData;

    if (isEdit && formData.id) {
      await updateProduct(formData.id, {
        ...dataWithoutImages,
        images: [], // tạm thời để rỗng
      });
      toast.success("Cập nhật sản phẩm thành công");
    } else {
      await addProduct({
        ...dataWithoutImages,
        images: [], // tạm thời để rỗng
      });
      toast.success("Thêm sản phẩm thành công");
    }

    setTimeout(() => onClose?.(), 500);
  } catch (error) {
    console.error("Firestore error:", error);
    toast.error("Lưu thất bại, vui lòng thử lại");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="add-product-container">
      <div className="add-product-form">
        <h2>{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-left">
            <label>Mã sản phẩm (Firestore ID)</label>
            <input
              type="text"
              value={formData.id || "Tự động tạo"}
              readOnly
              className="readonly-input"
            />

            <label>Tên sản phẩm</label>
            <input name="name" value={formData.name} onChange={handleChange} required />

            <label>Danh mục</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">-- Chọn danh mục --</option>
              {Object.entries(categories).map(([name, slug]) => (
                <option key={slug} value={slug}>{name}</option>
              ))}
            </select>

            <label>Giá (VNĐ)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />

            <label>Màu sắc</label>
            <input name="color" value={formData.color} onChange={handleChange} />

            <label>Chất liệu</label>
            <input name="material" value={formData.material} onChange={handleChange} />

            <label>Kích thước</label>
            <input name="size" value={formData.size} onChange={handleChange} />

            <label>Ram</label>
            <input name="size" value={formData.size} onChange={handleChange} />

            <label>Bộ nhớ trong</label>
            <input name="size" value={formData.size} onChange={handleChange} />


          </div>

          <div className="form-right">
            <label>Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            <label>Hình ảnh</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />

            <div className="preview-images">
              {formData.images.map((img, i) => (
                <img key={i} src={img.preview} alt="preview" />
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
              <button type="button" onClick={onClose}>Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
