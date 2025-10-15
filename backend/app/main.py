from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from .db import engine, init_db
import os

app = FastAPI(title="Demo API (FastAPI + Postgres)")

# CORS
origins = [os.getenv("CORS_ORIGINS", "http://localhost")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok"}

# ======================================
# ✅ MODEL
# ======================================
class TodoIn(BaseModel):
    title: str

class TodoOut(BaseModel):
    id: int
    title: str
    completed: bool

# ======================================
# ✅ CRUD TO-DO LIST
# ======================================

@app.get("/api/todos")
def list_todos():
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT id, title, completed FROM todos ORDER BY id DESC")).mappings().all()
        return {"todos": list(rows)}

@app.post("/api/todos", status_code=201)
def create_todo(todo: TodoIn):
    if not todo.title.strip():
        raise HTTPException(status_code=400, detail="Title is required.")
    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO todos (title, completed) VALUES (:t, false)"),
            {"t": todo.title},
        )
    return {"message": "Todo created."}

@app.put("/api/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoIn):
    with engine.begin() as conn:
        result = conn.execute(
            text("UPDATE todos SET title=:t WHERE id=:id RETURNING id"),
            {"t": todo.title, "id": todo_id},
        ).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo updated."}

@app.patch("/api/todos/{todo_id}/toggle")
def toggle_complete(todo_id: int):
    with engine.begin() as conn:
        result = conn.execute(
            text(
                "UPDATE todos SET completed = NOT completed WHERE id = :id RETURNING id, completed"
            ),
            {"id": todo_id},
        ).mappings().fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo toggled.", "completed": result["completed"]}

@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int):
    with engine.begin() as conn:
        result = conn.execute(
            text("DELETE FROM todos WHERE id=:id RETURNING id"), {"id": todo_id}
        ).fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted."}
