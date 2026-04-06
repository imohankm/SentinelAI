from fastapi import FastAPI, Depends, Request, Header
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="Acme E-commerce Portal")

# Mock Database for IDOR
mock_orders = {
    "101": {"user": "admin", "item": "Server Rack", "cc": "4111-xxxx-xxxx-1111"},
    "102": {"user": "john_doe", "item": "Laptop", "cc": "5555-xxxx-xxxx-2222"},
    "103": {"user": "jane_smith", "item": "Monitor", "cc": "3333-xxxx-xxxx-3333"}
}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Acme E-commerce"}

# VULNERABILITY 1: Broken Authentication (Accepts password == username for any admin)
@app.post("/api/auth/login")
def login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin":
        return {"status": "success", "token": "admin_session_token_12345"}
    if req.username == "test" and req.password == "test":
        return {"status": "success", "token": "test_session_token"}
    return {"status": "failed", "message": "Invalid password!"}

# VULNERABILITY 2: Insecure Direct Object Reference (IDOR)
@app.get("/api/orders/{order_id}")
def get_order(order_id: str):
    # Missing authorization check to ensure the order belongs to the logged-in user!
    if order_id in mock_orders:
        return {"status": "success", "data": mock_orders[order_id]}
    return {"status": "error", "message": "Order not found"}

# VULNERABILITY 3: Simulated XSS
@app.get("/api/search")
def search(query: str):
    # Reflects the raw input back into the response without sanitization
    # In a real web app, this JSON reflection would become XSS if parsed as HTML or injected into DOM.
    return {
        "status": "success",
        "message": f"No results found for your query: {query}",
        "raw_html": f"<div>Search results for: <b>{query}</b></div>"
    }

if __name__ == "__main__":
    uvicorn.run("server_juice_shop:app", host="0.0.0.0", port=8081, reload=False)
