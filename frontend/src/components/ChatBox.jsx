import React, { useState, useEffect } from "react";
import "./chat.css";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function ChatBox() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [greeted, setGreeted] = useState(false);

  // LOAD DATA
  useEffect(() => {
    const fetchAll = async () => {
      const snapshot = await getDocs(collection(db, "Products"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllProducts(data);
    };
    fetchAll();
  }, []);

  // GREETING
 useEffect(() => {
  if (open && !greeted) {
    setMessages([
      { text: "👋 Xin chào! Bạn cần tư vấn gì ạ?", sender: "ai" }
    ]);
    setGreeted(true);
  }
}, [open, greeted]);

  // ===== MATCH THÔNG MINH =====
  const findBestMatch = (keyword) => {

    const words = keyword.toLowerCase().split(" ");

    let best = null;
    let maxScore = 0;

    allProducts.forEach(p => {

      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();

      let score = 0;

      words.forEach(w => {
        if (text.includes(w)) score++;
      });

      if (score > maxScore) {
        maxScore = score;
        best = p;
      }

    });

    return best;
  };

  // ===== AI =====
  const handleAI = (msg) => {

    const message = msg.toLowerCase();

    // ===== SO SÁNH =====
    if (message.includes("so sánh")) {

      const cleaned = message.replace("so sánh", "").trim();

      // so sánh 2 sản phẩm
      if (cleaned.includes("và")) {

        const parts = cleaned.split("và");

        const p1 = findBestMatch(parts[0].trim());
        const p2 = findBestMatch(parts[1].trim());

        if (p1 && p2) {
          return { type: "compare", products: [p1, p2] };
        }

        return {
          type: "text",
          text: "Không tìm thấy sản phẩm để so sánh."
        };
      }

      // 👉 so sánh theo category
      const list = allProducts.filter(p =>
        p.category?.toLowerCase().includes(cleaned)
      );

      if (list.length >= 2) {
        return {
          type: "compare",
          products: list.slice(0,2)
        };
      }
    }

    // ===== LỌC GIÁ =====
    if (message.includes("dưới")) {

      const number = parseInt(message.match(/\d+/));

      if (number) {

        const results = allProducts.filter(p =>
          p.price <= number * 1000000
        );

        return {
          type: "list",
          products: results.slice(0,5)
        };
      }
    }

    // ===== TÌM KIẾM =====
    const results = allProducts.filter(p => {

      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();

      return text.includes(message);

    });

    if (results.length > 0) {
      return { type: "list", products: results.slice(0,5) };
    }

    return {
      type: "text",
      text: "Xin lỗi tôi chưa tìm thấy sản phẩm."
    };
  };

  // SEND
  const sendMessage = () => {

    if (!message.trim()) return;

    setMessages(prev => [...prev, { text: message, sender: "user" }]);

    const result = handleAI(message);

    if (result.type === "compare") {
      setMessages(prev => [...prev, { sender: "ai", compare: result.products }]);
    } else if (result.type === "list") {
      setMessages(prev => [...prev, { sender: "ai", products: result.products }]);
    } else {
      setMessages(prev => [...prev, { sender: "ai", text: result.text }]);
    }

    setMessage("");
  };

  return (
    <>
      <div className="chat-icon" onClick={() => setOpen(!open)}>💬</div>

      {open && (
        <div className="chat-box">

          <div className="chat-header">chăm sóc & hỗ trợ khách hàng </div>

          <div className="chat-body">

            {messages.map((msg, i) => (

              <div key={i}>

                {msg.text && (
                  <div className={msg.sender === "user" ? "chat-message user" : "chat-message ai"}>
                    {msg.text}
                  </div>
                )}

                {/* LIST */}
                {msg.products && msg.products.map((p, index) => (
                  <div className="chat-product-card" key={index}>
                    <img src={p.images?.[0]} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p>{p.price?.toLocaleString()}đ</p>
                    <Link to={`/product/${p.id}`}>Xem sản phẩm</Link>
                  </div>
                
                ))}

                {/* COMPARE */}
                {msg.compare && (
                  <div className="compare-box">
                    <table className="compare-table">
                      <thead>
                        <tr>
                          <th>Thông số</th>
                          <th>{msg.compare[0].name}</th>
                          <th>{msg.compare[1].name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Giá</td>
                          <td>{msg.compare[0].price?.toLocaleString()}đ</td>
                          <td>{msg.compare[1].price?.toLocaleString()}đ</td>
                        </tr>
                        <tr>
                          <td>Danh mục</td>
                          <td>{msg.compare[0].category}</td>
                          <td>{msg.compare[1].category}</td>
                        </tr>
                        <tr>
                          <td>Thương hiệu</td>
                          <td>{msg.compare[0].brand}</td>
                          <td>{msg.compare[1].brand}</td>
                        </tr>
                        <tr>
                          <td>RAM</td>
                          <td>{msg.compare[0].ram || "-"}</td>
                          <td>{msg.compare[1].ram || "-"}</td>
                        </tr>
                        <tr>
                          <td>Chip</td>
                          <td>{msg.compare[0].chip || "-"}</td>
                          <td>{msg.compare[1].chip || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            ))}

          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hỏi sản phẩm..."
               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBox;