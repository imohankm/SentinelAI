from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
import sqlite3
import uvicorn
import os

app = FastAPI(title="Acme Corp Demo Server")

DB_FILE = "acme_corp.db"

# Server Configuration State (Simulating environment configuration)
app.state.config = {
    "mfa_enabled": False,
    "sql_patched": False,
    "ports_closed": False
}

def init_db():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)''')
    cursor.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'supersecretpassword123', 'admin')")
    cursor.execute("INSERT INTO users (username, password, role) VALUES ('emp1', 'password', 'user')")
    conn.commit()
    conn.close()

init_db()

class LoginRequest(BaseModel):
    username: str
    password: str

class PatchRequest(BaseModel):
    mfa_enabled: bool
    sql_patched: bool
    ports_closed: bool

@app.get("/")
def read_root():
    return {"message": "Welcome to Acme Corp API"}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Intentionally vulnerable SQL Injection or Secure based on config
    if not app.state.config["sql_patched"]:
        # VULNERABLE
        query = f"SELECT * FROM users WHERE username = '{req.username}' AND password = '{req.password}'"
        try:
            cursor.execute(query)
            user = cursor.fetchone()
        except sqlite3.Error as e:
            return {"error": "Database error", "details": str(e)}
    else:
        # SECURE
        query = "SELECT * FROM users WHERE username = ? AND password = ?"
        cursor.execute(query, (req.username, req.password))
        user = cursor.fetchone()
        
    conn.close()

    if user:
        if app.state.config["mfa_enabled"]:
            # Pretend it requires an MFA token that isn't provided
            return {"status": "mfa_required", "message": "Please provide your 6-digit MFA token"}
        return {"status": "success", "user_role": user[3], "message": "Login successful"}
    
    return {"status": "failed", "message": "Invalid credentials"}

@app.get("/api/system/ports")
def check_ports():
    if app.state.config["ports_closed"]:
        return {"status": "secure", "open_ports": [80, 443]}
    else:
        return {"status": "vulnerable", "open_ports": [22, 80, 443, 3389]}

@app.post("/devops/patch")
def apply_patch(req: PatchRequest):
    """Admin endpoint to deploy fixes to the mock server"""
    app.state.config["mfa_enabled"] = req.mfa_enabled
    app.state.config["sql_patched"] = req.sql_patched
    app.state.config["ports_closed"] = req.ports_closed
    return {"status": "patched", "current_config": app.state.config}

@app.get("/devops/status")
def get_status():
    return app.state.config

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8080, reload=False)
