import os
from sqlalchemy import create_engine, text

# ====== Cấu hình Database ======
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USERNAME = os.getenv("DB_USERNAME", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "matkhau")
DB_DATABASE = os.getenv("DB_DATABASE", "icloud_db")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# ====== Hàm khởi tạo DB ======
def init_db():
    with engine.begin() as conn:
        # Bảng items (cũ)
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL
        );
        """))

        # Bảng todos (mới)
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );
        """))
