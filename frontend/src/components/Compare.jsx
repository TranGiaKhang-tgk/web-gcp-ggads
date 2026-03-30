import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Compare() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 load từ localStorage ngay từ đầu
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("compare");
    return saved ? JSON.parse(saved) : [null, null, null];
  });

  // 🔥 nhận sản phẩm từ trang select
  useEffect(() => {
    if (location.state?.selectedProduct !== undefined) {
      const { selectedProduct, index } = location.state;

      if (index === undefined) return;

      setSelected(prev => {
        const newArr = [...prev];
        newArr[index] = selectedProduct;
        return newArr;
      });
    }
  }, [location.state]);

  // 🔥 lưu lại (fix mất dữ liệu)
  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(selected));
  }, [selected]);

  const handleCompare = () => {
    if (selected.filter(Boolean).length < 2) {
      alert("Chọn ít nhất 2 sản phẩm");
      return;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>So sánh sản phẩm</h3>

      {/* 🔥 3 KHUNG */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {selected.map((p, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              border: "1px dashed #ccc",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "#fff",
              borderRadius: "10px",
            }}
            onClick={() =>
              navigate("/compare/select", {
                state: {
                  index: i,
                  firstProduct: selected[0],
                },
              })
            }
          >
            {p ? (
              <div style={{ textAlign: "center" }}>
                <img
                  src={p.images?.[0]}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                />
                <p style={{ fontSize: "13px" }}>{p.name}</p>

                {/* ❌ nút xoá */}
                <p
                  style={{
                    color: "red",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(prev => {
                      const newArr = [...prev];
                      newArr[i] = null;
                      return newArr;
                    });
                  }}
                >
                  Xóa
                </p>
              </div>
            ) : (
              <span>➕ Chọn sản phẩm</span>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 NÚT SO SÁNH */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
          onClick={handleCompare}
        >
          So sánh
        </button>
      </div>

      {/* 🔥 KẾT QUẢ */}
      {selected.filter(Boolean).length >= 2 && (
        <div style={{ marginTop: "30px" }}>
          <h4>Kết quả so sánh</h4>

          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Thông số</th>
                {selected.filter(Boolean).map((p) => (
                  <th key={p.id}>{p.name}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Giá</td>
                {selected.filter(Boolean).map((p) => (
                  <td key={p.id}>
                    {p.price?.toLocaleString()}đ
                  </td>
                ))}
              </tr>

              <tr>
                <td>RAM</td>
                {selected.filter(Boolean).map((p) => (
                  <td key={p.id}>{p.ram || "-"}</td>
                ))}
              </tr>

              <tr>
                <td>Chip</td>
                {selected.filter(Boolean).map((p) => (
                  <td key={p.id}>{p.chip || "-"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Compare;