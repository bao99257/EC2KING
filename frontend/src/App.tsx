import React, { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Lấy danh sách todo từ backend
  async function fetchTodos() {
    setLoading(true);
    const res = await fetch("/api/todos").then((r) => r.json()).catch(() => ({ todos: [] }));
    setTodos(res.todos || []);
    setLoading(false);
  }

  // 🔹 Thêm todo mới
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTodos();
  }

  // 🔹 Xoá todo
  async function deleteTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  // 🔹 Đổi trạng thái hoàn thành
  async function toggleTodo(id: number) {
    await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="page">
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="container">
        <h1 className="hero-title">To-Do List 🚀</h1>
        <p className="hero-subtitle">Quản lý công việc hằng ngày của bạn</p>

        {/* Form thêm */}
        <form onSubmit={addTodo} className="form">
          <input
            placeholder="Nhập việc cần làm..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Thêm</button>
        </form>

        {/* Danh sách todo */}
        <ul className="item-list">
          {loading && <li>Đang tải...</li>}
          {!loading && todos.length === 0 && <li>Chưa có công việc nào 🎉</li>}
          {todos.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "#ccc" : "white",
                  cursor: "pointer",
                }}
                onClick={() => toggleTodo(t.id)}
              >
                {t.title}
              </span>
              <button
                onClick={() => deleteTodo(t.id)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Giữ lại phần hiệu ứng đẹp */}
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
