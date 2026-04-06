from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="SentinelAI Simulation Engine API")

# Setup CORS for the frontend React application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FixStateRequest(BaseModel):
    mfa_enabled: bool
    sql_patched: bool
    ports_closed: bool

@app.get("/")
def read_root():
    return {"status": "SentinelAI Engine Active", "version": "1.0"}

@app.get("/api/scan")
def get_vulnerabilities():
    """Simulate a scan of a Fake Company Server (e.g. Juice Shop)"""
    return {
        "target": "Simulated Corp Server",
        "vulnerabilities": [
            {"id": "V1", "name": "No MFA Enabled", "severity": "High", "description": "Global user authentication lacks Multi-Factor Authentication."},
            {"id": "V2", "name": "SQL Injection Possible", "severity": "Critical", "description": "Login endpoint /api/auth is susceptible to SQLi."},
            {"id": "V3", "name": "Open Ports Detected", "severity": "Medium", "description": "Ports 22, 3389 exposed to external internet."}
        ],
        "base_risk_score": 85
    }

@app.post("/api/attack")
def run_attack_simulation(req: FixStateRequest):
    """Run an attack simulation and return the success rate based on the fixes applied."""
    base_success_rate = 85
    
    logs = [
        "[INFO] Initiating Agentic Attack Simulation sequence...",
        "[RECON] Enumerating attack surface...",
        "[RECON] Identified potential vectors: Auth, Database, Network."
    ]
    
    if not req.ports_closed:
        logs.append("[ATTACK] Exploiting open port 3389... Success.")
        logs.append("[EXPLOIT] Establishing C2 connection via open port.")
    else:
        logs.append("[ATTACK] Attempting external port scan... Blocked (No vulnerable ports found).")
        base_success_rate -= 20
        
    if not req.sql_patched:
        logs.append("[ATTACK] Fuzzing /api/auth endpoint. SQLi detected!")
        logs.append("[EXPLOIT] Dumped user credential hashes via SQLi.")
    else:
        logs.append("[ATTACK] Attempting SQL injection on /api/auth... Blocked (Input sanitized).")
        base_success_rate -= 30
        
    if not req.mfa_enabled:
        logs.append("[ATTACK] Using compromised credentials to login... Success (No MFA challenge).")
        logs.append("[CRITICAL] Full System Breached.")
    else:
        logs.append("[ATTACK] Using compromised credentials to login... Blocked by MFA challenge.")
        base_success_rate -= 15 # Tweaked so 85 - 20 - 30 - 15 = 20% max fix

    if base_success_rate <= 25:
        logs.append("[INFO] Attack failed. System defenses held.")
        
    return {
        "success_rate": max(0, base_success_rate),
        "logs": logs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
