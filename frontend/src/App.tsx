import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [health, setHealth] = useState<string>("checking...");
  const [items, setItems] = useState<{ id: number; title: string }[]>([]);
  const [title, setTitle] = useState("");

  async function refresh() {
    const h = await fetch("/api/health")
      .then((r) => r.json())
      .catch(() => ({ status: "fail" }));
    setHealth(h.status ?? "fail");

    const it = await fetch("/api/items")
      .then((r) => r.json())
      .catch(() => ({ items: [] }));
    setItems(it.items || []);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="page">
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="container">
        <h1 className="hero-title">Welcome to the Future</h1>
        <p className="hero-subtitle">Trải nghiệm web hiện đại và đẳng cấp</p>
        <button className="cta-button" onClick={() => alert("Chào mừng bạn! 🎉")}>
          Bắt Đầu Ngay
        </button>

        {/* <p style={{ color: "white", marginTop: "2rem" }}>
          fini <b>{health}</b>
        </p> */}

        <form onSubmit={addItem} className="form">
          <input
            placeholder="Nhập tiêu đề mới..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Thêm</button>
        </form>

        <ul className="item-list">
          {items.map((i) => (
            <li key={i.id}>
              #{i.id}: {i.title}
            </li>
          ))}
        </ul>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Nhanh Chóng</h3>
            <p className="feature-text">
              Hiệu suất tối ưu cho trải nghiệm mượt mà
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">Thiết Kế Đẹp</h3>
            <p className="feature-text">
              Giao diện hiện đại và thu hút người dùng
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Đổi Mới</h3>
            <p className="feature-text">
              Công nghệ tiên tiến và sáng tạo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
