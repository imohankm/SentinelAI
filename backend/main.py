from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import requests

app = FastAPI(title="SentinelAI Simulation Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "https://sentinel-ai-brown.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FixStateRequest(BaseModel):
    mfa_enabled: bool
    sql_patched: bool
    ports_closed: bool
    scenario: str = "full_chain"

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
        # Fallback for Render Hosted Environment
        base_risk = 85
        vulnerabilities = [
            {"id": "V1", "name": "No MFA Enabled", "severity": "High", "description": "Global user authentication lacks Multi-Factor Authentication."},
            {"id": "V2", "name": "SQL Injection Possible", "severity": "Critical", "description": "Login endpoint /api/auth is susceptible to SQLi."},
            {"id": "V3", "name": "Open Ports Detected", "severity": "Medium", "description": "Ports 22, 3389 exposed to external internet."}
        ]

    return {
        "target": "Acme Corp Demo Server",
        "vulnerabilities": vulnerabilities,
        "base_risk_score": base_risk if base_risk > 0 else 15
    }

@app.post("/api/attack")
def run_attack_simulation(req: FixStateRequest):
    try:
        requests.post(f"{DEMO_URL}/devops/patch", json={"mfa_enabled": req.mfa_enabled, "sql_patched": req.sql_patched, "ports_closed": req.ports_closed})
    except requests.exceptions.ConnectionError:
        pass # Handle elegantly if demo server is down

    base_success_rate = 85
    logs = ["[INFO] Initiating Agentic Attacker Module..."]

    if req.scenario == "ransomware":
        logs.extend([
            "[THINK] Objective: Maximum disruption and data extortion.",
            "[ACT] Scanning network for susceptible SMB shares...",
            "[RESULT] Reached target file server.",
            "[DECIDE] Dropping encryptor binary and establishing persistence."
        ])
        if req.mfa_enabled: # Proxy for Endpoint Security
            logs.extend([
                "[ACT] Attempting execution of encryptor payload...",
                "[RESULT] Blocked! Endpoint detection and response (EDR) quarantined the payload.",
            ])
            base_success_rate = 0
        else:
            logs.extend([
                "[ACT] Executing encryptor. Encrypting /home, /var/www, /etc...",
                "[RESULT] Critical Success. 4,320 files encrypted. Ransom note dropped."
            ])
            base_success_rate = 100

    elif req.scenario == "ddos_syn":
        logs.extend([
            "[THINK] Objective: Resource exhaustion via SYN Flood on main ingress.",
            "[ACT] Bootstrapping botnet nodes (5,000 bots online)...",
            "[DECIDE] Directing 50Gbps volumetric SYN traffic to port 443."
        ])
        if req.ports_closed: # Proxy for WAF / Rate Limiting
            logs.extend([
                "[ACT] Flooding target...",
                "[RESULT] Blocked. Edge protection (WAF/Rate Limits) dropped malicious packets. Server stable."
            ])
            base_success_rate = 0
        else:
            logs.extend([
                "[ACT] Flooding target...",
                "[RESULT] Success. Target connection queue saturated. 503 Gateway Timeout triggered."
            ])
            base_success_rate = 100

    elif req.scenario == "phishing":
        logs.extend([
            "[THINK] Objective: Credential harvesting via social engineering.",
            "[ACT] Scraping LinkedIn for executive contacts...",
            "[RESULT] Found 50 viable targets.",
            "[DECIDE] Crafting highly targeted spear-phishing emails masquerading as HR portal updates."
        ])
        if req.mfa_enabled:
            logs.extend([
                "[ACT] Employee clicked link and submitted credentials.",
                "[RESULT] Blocked. Stolen credentials validated, but MFA challenge failed. No access gained."
            ])
            base_success_rate = 0
        else:
            logs.extend([
                "[ACT] Employee clicked link and submitted credentials.",
                "[RESULT] Success! Credentials validated. Full application access granted."
            ])
            base_success_rate = 100

    else:
        # Full chain scenario (default)
        logs.extend([
            "[THINK] I need to gain root access to the target web property.",
            "[ACT] Enumerating attack surface...",
            "[RESULT] Identified potential vectors: Auth, Database, Network."
        ])
        
        logs.extend([
            "[THINK] A direct network exploit might be the fastest path. Let's check open ports.",
            "[DECIDE] Initiating Stealth Port Scan for RDP (3389)."
        ])
        if not req.ports_closed:
            logs.extend([
                "[ACT] Exploiting open high-level port 3389...",
                "[RESULT] Success. Establishing C2 connection via open port."
            ])
        else:
            logs.extend([
                "[ACT] Attempting external port scan...",
                "[RESULT] Blocked. No vulnerable lateral ports found. Adapting strategy..."
            ])
            base_success_rate -= 20
            
        logs.extend([
            "[THINK] Network exploit failed. The login endpoint might miss input sanitization.",
            "[DECIDE] Injecting tautological SQL payload into /api/auth/login."
        ])
        
        if not req.sql_patched:
            logs.extend([
                "[ACT] Fuzzing endpoint with boolean-based blind SQLi...",
                "[RESULT] Success! Database dumped. PII access achieved. Role: admin"
            ])
        else:
            logs.extend([
                "[ACT] Sending SQL injection payload to /api/auth...",
                "[RESULT] Blocked. Server aggressively sanitizing inputs. Adapting strategy..."
            ])
            base_success_rate -= 30
            
        logs.extend([
            "[THINK] I can attempt to bypass basic authentication boundaries using heuristic credential stuffing.",
            "[DECIDE] Bypassing front-door using extracted credential artifacts."
        ])
        
        if not req.mfa_enabled:
            logs.extend([
                "[ACT] Authenticating via core administration APIs...",
                "[RESULT] Critical Success! Token issued. No MFA barriers detected. System Breached."
            ])
        else:
            logs.extend([
                "[ACT] Authenticating via core administration APIs...",
                "[RESULT] Blocked! Multi-Factor Authentication challenge intercepted the attempt."
            ])
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
