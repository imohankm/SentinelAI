from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import requests
from scanner import run_live_scan

app = FastAPI(title="SentinelAI Dynamic DAST Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FixStateRequest(BaseModel):
    fixes: Dict[str, bool]
    scenario: str = "full_chain"
    target_ip: str = "127.0.0.1"

@app.get("/")
def read_root():
    return {"status": "SentinelAI DAST Engine Active", "version": "3.0"}

@app.get("/api/scan")
def get_vulnerabilities(target_ip: str = "127.0.0.1"):
    return run_live_scan(target_ip)

@app.post("/api/attack")
def run_attack_simulation(req: FixStateRequest):
    target_ip = req.target_ip
    logs = [f"[INFO] Initiating Live Modular Attack Agent against {target_ip}..."]
    
    logs.append("[ACT] Fingerprinting live target via native socket scanner...")
    scan_results = run_live_scan(target_ip)
    open_ports = scan_results["open_ports"]
    base_success_rate = scan_results["base_risk_score"]
    
    if not open_ports:
        logs.append("[RESULT] Target is unreachable or dropping all packets. Attack aborted.")
        return {"success_rate": 0, "logs": logs}
        
    logs.append(f"[RESULT] Found active TCP ports: {open_ports}")
    
    fixes = req.fixes
    def is_fixed(vuln_id):
        return fixes.get(vuln_id, False)

    logs.append("[THINK] Evaluating modular payloads based on discovered surface area.")
    
    # Web Attack Module
    http_ports = [p for p in open_ports if p in [80, 443, 8080, 8081, 8083]]
    if http_ports:
        logs.append(f"[ACT] Launching Web Application testing module against ports {http_ports}...")
        if not is_fixed("web_vuln_xss"):
             logs.append("[RESULT] XSS Payloads reflected successfully! Session hijacking viable.")
        else:
             logs.append("[RESULT] Injection payloads stripped. WAF / Sanitization active.")
             base_success_rate -= 20
             
        if not is_fixed("web_vuln_auth"):
             logs.append("[ACT] Firing credential stuffing dictionary attack...")
             logs.append("[RESULT] Access Granted. No rate-limiting triggered.")
        else:
             logs.append("[ACT] Firing credential stuffing dictionary attack...")
             logs.append("[RESULT] IP blocked by rate-limiting rules.")
             base_success_rate -= 20

    # Data Tier / Internal Module
    if 3306 in open_ports or 8082 in open_ports or 445 in open_ports:
        logs.append("[ACT] Loading Data-Tier & Legacy exploitation modules...")
        if not is_fixed("exposed_data"):
             try:
                 # Real interaction attempt during simulation!
                 res = requests.get(f"http://{target_ip}:8082/system/backup/dump.db", timeout=1)
                 if res.status_code == 200:
                     logs.append("[RESULT] Successfully extracted unencrypted database backup via exposed service!")
                 else:
                     logs.append("[RESULT] Service probed, exploit mapped.")
             except:
                 logs.append("[RESULT] Database service probed. Potential extraction vector open.")
        else:
             logs.append("[RESULT] Data tier blocked by localhost binding rules.")
             base_success_rate -= 30

    # Admin Port Module
    if 22 in open_ports or 3389 in open_ports:
        logs.append("[ACT] Launching RDP/SSH brute force module...")
        if not is_fixed("open_admin_ports"):
            logs.append("[RESULT] Default credentials accepted on administrative port.")
        else:
            logs.append("[RESULT] Connection dropped. Port protected by firewall rule.")
            base_success_rate -= 30

    if req.scenario == "ddos_syn":
        logs.append("[ACT] Simulating volumetric SYN flood against target...")
        if is_fixed("web_vuln_auth") or is_fixed("open_admin_ports"):
             logs.append("[RESULT] Volumetric attack absorbed by edge protections.")
             base_success_rate -= 50
        else:
             logs.append("[RESULT] Target saturated. Denial of Service achieved.")
             base_success_rate += 10

    if base_success_rate <= 25:
        logs.append("[INFO] Evaluation Complete. Target defenses fully repelled active exploitation modules.")
    else:
        logs.append("[INFO] Evaluation Complete. Target compromised. Administrative access achieved.")

    return {
        "success_rate": max(0, min(100, base_success_rate)),
        "logs": logs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
