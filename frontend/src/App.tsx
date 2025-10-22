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

  // 🔽 STATE MỚI: Theo dõi todo đang được chỉnh sửa
  const [editingState, setEditingState] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // 🔹 Lấy danh sách todo từ backend
  async function fetchTodos() {
    setLoading(true);
    const res = await fetch("/api/todos")
      .then((r) => r.json())
      .catch(() => ({ todos: [] }));
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

  // 🔽 HÀM MỚI: Cập nhật (Sửa) todo
  async function updateTodo(id: number, newTitle: string) {
    if (!newTitle.trim()) {
      // Nếu tiêu đề mới rỗng, hủy bỏ việc sửa
      setEditingState(null);
      return;
    }
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setEditingState(null); // Thoát chế độ chỉnh sửa
    fetchTodos(); // Tải lại danh sách
  }

  // 🔹 Xoá todo
  async function deleteTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  // 🔹 Đổi trạng thái hoàn thành
  async function toggleTodo(id: number) {
    // Không cho phép toggle khi đang sửa
    if (editingState && editingState.id === id) return;
    await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = () => {
    if (editingState) {
      updateTodo(editingState.id, editingState.title);
    }
  };

  // Hàm xử lý khi thay đổi nội dung trong ô input sửa
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingState) {
      setEditingState({ ...editingState, title: e.target.value });
    }
  };

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
              {/* 🔽 LOGIC RENDER MỚI: Hiển thị ô input hoặc text */}
              {editingState && editingState.id === t.id ? (
                // --- Chế độ SỬA ---
                <>
                  <input
                    type="text"
                    value={editingState.title}
                    onChange={handleEditChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()} // Cho phép nhấn Enter để lưu
                    autoFocus
                    className="edit-input"
                  />
                  <div className="button-group">
                    <button
                      onClick={handleSave}
                      className="btn-action btn-save"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingState(null)}
                      className="btn-action btn-cancel"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                // --- Chế độ XEM (bình thường) ---
                <>
                  <span
                    style={{
                      textDecoration: t.completed ? "line-through" : "none",
                      color: t.completed ? "#ccc" : "white",
                      cursor: "pointer",
                      // 🔽 Thêm style để tiêu đề không bị tràn
                      wordBreak: "break-all",
                      flexGrow: 1,
                      textAlign: "left",
                    }}
                    onClick={() => toggleTodo(t.id)}
                  >
                    {t.title}
                  </span>
                  <div className="button-group">
                    {/* Nút Sửa */}
                    <button
                      onClick={() =>
                        setEditingState({ id: t.id, title: t.title })
                      }
                      className="btn-action btn-edit"
                    >
                      ✏️
                    </button>
                    {/* Nút Xóa (đã bỏ inline style và dùng class) */}
                    <button
                      onClick={() => deleteTodo(t.id)}
                      className="btn-action btn-delete"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Giữ lại phần hiệu ứng đẹp */}
        <div className="features">{/* ... (không thay đổi) ... */}</div>
      </div>
    </div>
  );
}