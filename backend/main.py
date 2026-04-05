from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SentinelAI Simulation Engine API")

# Setup CORS for the frontend React application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WhatIfRequest(BaseModel):
    mfa_enabled: bool
    training_enabled: bool

@app.get("/")
def read_root():
    return {"status": "SentinelAI Engine Active", "version": "1.0"}

@app.get("/api/twin/{emp_id}")
def get_twin_profile(emp_id: str):
    """Fetch behavioral profile for an employee"""
    # Mock data structure to be hooked up to a real DB or AI engine
    if emp_id == "EMP1":
        return {"emp_id": emp_id, "role": "Admin", "risk_score": 12, "notes": "Secure patterns."}
    elif emp_id == "EMP2":
        return {"emp_id": emp_id, "role": "Sales", "risk_score": 82, "notes": "High phishing susceptibility."}
    return {"error": "Employee not found"}

@app.post("/api/simulate/whatif")
def calculate_whatif(req: WhatIfRequest):
    """Calculate the Success Rate probability based on defensive policies"""
    base_success_rate = 80
    if req.mfa_enabled:
        base_success_rate -= 50
    if req.training_enabled:
        base_success_rate -= 15
    return {"calculated_success_rate": max(0, base_success_rate)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
