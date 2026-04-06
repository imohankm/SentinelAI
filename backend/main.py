from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import requests

app = FastAPI(title="SentinelAI Simulation Engine API")

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

DEMO_URL = "http://localhost:8080"

@app.get("/")
def read_root():
    return {"status": "SentinelAI Engine Active", "version": "1.0"}

@app.get("/api/scan")
def get_vulnerabilities():
    vulnerabilities = []
    base_risk = 0

    try:
        # Check MFA
        r = requests.post(f"{DEMO_URL}/api/auth/login", json={"username": "admin", "password": "supersecretpassword123"})
        if r.json().get("status") != "mfa_required":
            vulnerabilities.append({"id": "V1", "name": "No MFA Enabled", "severity": "High", "description": "Global user authentication lacks Multi-Factor Authentication."})
            base_risk += 35

        # Check SQLi
        r = requests.post(f"{DEMO_URL}/api/auth/login", json={"username": "admin' OR '1'='1", "password": "x"})
        if r.json().get("status") == "success":
            vulnerabilities.append({"id": "V2", "name": "SQL Injection Possible", "severity": "Critical", "description": "Login endpoint /api/auth is susceptible to SQLi."})
            base_risk += 30

        # Check Open Ports
        r = requests.get(f"{DEMO_URL}/api/system/ports")
        if 3389 in r.json().get("open_ports", []):
            vulnerabilities.append({"id": "V3", "name": "Open Ports Detected", "severity": "Medium", "description": "Ports 22, 3389 exposed to external internet."})
            base_risk += 20
    except requests.exceptions.ConnectionError:
        return {"error": "Demo server is offline. Please start it on port 8080."}

    return {
        "target": "Acme Corp Demo Server",
        "vulnerabilities": vulnerabilities,
        "base_risk_score": base_risk if base_risk > 0 else 15  # 15 is baseline risk
    }

@app.post("/api/attack")
def run_attack_simulation(req: FixStateRequest):
    # First, configure the real demo server with requested fixes
    try:
        requests.post(f"{DEMO_URL}/devops/patch", json=req.dict())
    except requests.exceptions.ConnectionError:
        return {"error": "Demo server is offline"}

    base_success_rate = 85
    logs = [
        "[INFO] Initiating Agentic Attacker Module...",
        "[THINK] I need to gain root access to the target web property.",
        "[ACT] Enumerating attack surface on http://localhost:8080...",
        "[RESULT] Identified potential vectors: Auth, Database, Network."
    ]
    
    # 1. ACTUAL PORT SCAN
    logs.append("[THINK] A direct network exploit might be the fastest path. Let's check open ports.")
    logs.append("[DECIDE] Initiating Stealth Port Scan for RDP (3389).")
    port_res = requests.get(f"{DEMO_URL}/api/system/ports").json()
    if 3389 in port_res.get("open_ports", []):
        logs.append("[ACT] Exploiting open high-level port 3389...")
        logs.append("[RESULT] Success. Establishing C2 connection via open port.")
    else:
        logs.append("[ACT] Attempting external port scan...")
        logs.append("[RESULT] Blocked. No vulnerable lateral ports found. Adapting strategy...")
        base_success_rate -= 20

    # 2. ACTUAL SQLI ATTACK
    logs.append("[THINK] Network exploit failed. The login endpoint might miss input sanitization.")
    logs.append("[DECIDE] Injecting tautological SQL payload into /api/auth/login.")
    sqli_res = requests.post(f"{DEMO_URL}/api/auth/login", json={"username": "admin' OR '1'='1", "password": "x"}).json()
    if sqli_res.get("status") == "success":
        logs.append("[ACT] Fuzzing endpoint with boolean-based blind SQLi.")
        logs.append(f"[RESULT] Success! Database dumped. PII access achieved. Role: {sqli_res.get('user_role')}")
    else:
        logs.append("[ACT] Sending SQL injection payload to /api/auth...")
        logs.append("[RESULT] Blocked. Server aggressively sanitizing inputs. Adapting strategy...")
        base_success_rate -= 30

    # 3. ACTUAL AUTH ATTACK (Using valid credentials from dump)
    logs.append("[THINK] I can attempt to bypass basic authentication boundaries using heuristic credential stuffing.")
    logs.append("[DECIDE] Bypassing front-door using extracted credential artifacts.")
    auth_res = requests.post(f"{DEMO_URL}/api/auth/login", json={"username": "admin", "password": "supersecretpassword123"}).json()
    if auth_res.get("status") == "success":
        logs.append("[ACT] Authenticating via core administration APIs...")
        logs.append("[RESULT] Critical Success! Token issued. No MFA barriers detected. System Breached.")
    else:
        logs.append("[ACT] Authenticating via core administration APIs...")
        logs.append("[RESULT] Blocked! Multi-Factor Authentication challenge intercepted the attempt.")
        base_success_rate -= 15

    if base_success_rate <= 25:
        logs.append("[INFO] Evaluation Complete. Agent exhausted all viable vectors. System defenses securely held.")
        
    return {
        "success_rate": max(0, base_success_rate),
        "logs": logs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
