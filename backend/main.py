from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="SentinelAI Simulation Engine API")

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
    target_id: str = "corp_lab"

TARGET_PROFILES = {
    "corp_lab": {
        "name": "Corporate Internal Lab XYZ",
        "base_risk": 85,
        "vulnerabilities": [
            {"id": "mfa_enabled", "name": "No MFA Enabled", "severity": "High", "description": "Global user authentication lacks Multi-Factor Authentication.", "fix_label": "Enable MFA", "fix_desc": "Require 2FA globally"},
            {"id": "sql_patched", "name": "SQL Injection Possible", "severity": "Critical", "description": "Login endpoint /api/auth is susceptible to SQLi.", "fix_label": "Patch SQL Vuls", "fix_desc": "Sanitize inputs"},
            {"id": "ports_closed", "name": "Open Ports Detected", "severity": "Medium", "description": "Ports 22, 3389 exposed to external internet.", "fix_label": "Close External Ports", "fix_desc": "Block traffic to 22 & 3389"}
        ]
    },
    "juice_shop": {
        "name": "OWASP Juice Shop (Web)",
        "base_risk": 90,
        "vulnerabilities": [
            {"id": "weak_auth", "name": "Broken Authentication", "severity": "Critical", "description": "Admin accounts use default or easily guessable passwords.", "fix_label": "Enforce Strong Passwords", "fix_desc": "Require complexity/length"},
            {"id": "xss_patched", "name": "Cross-Site Scripting (XSS)", "severity": "High", "description": "Search bars reflect unsanitized user input.", "fix_label": "Sanitize Inputs", "fix_desc": "Deploy XSS input filters"},
            {"id": "idor_patched", "name": "Insecure Direct Object Reference", "severity": "Medium", "description": "Users can access other users' receipts by modifying ID in URL.", "fix_label": "Implement RBAC", "fix_desc": "Check user roles on access"}
        ]
    },
    "legacy_db": {
        "name": "DVWA Legacy Database Server",
        "base_risk": 95,
        "vulnerabilities": [
            {"id": "kernel_patched", "name": "Unpatched OS Kernel", "severity": "Critical", "description": "Running Windows Server 2008 R2, vulnerable to EternalBlue.", "fix_label": "Apply OS Patches", "fix_desc": "Update to latest kernel"},
            {"id": "default_creds", "name": "Default Admin Credentials", "severity": "High", "description": "Database root user still using default password.", "fix_label": "Rotate Credentials", "fix_desc": "Change default passwords"},
            {"id": "encryption_enabled", "name": "Unencrypted Storage", "severity": "Critical", "description": "PII stored in plaintext on disk.", "fix_label": "Enable Encryption at Rest", "fix_desc": "Use AES-256 for disks"}
        ]
    }
}

@app.get("/")
def read_root():
    return {"status": "SentinelAI Multi-Server Engine Active", "version": "2.0"}

@app.get("/api/scan")
def get_vulnerabilities(target_id: str = "corp_lab"):
    if target_id not in TARGET_PROFILES:
        target_id = "corp_lab"
    profile = TARGET_PROFILES[target_id]
    
    return {
        "target": profile["name"],
        "base_risk_score": profile["base_risk"],
        "vulnerabilities": profile["vulnerabilities"]
    }

@app.post("/api/attack")
def run_attack_simulation(req: FixStateRequest):
    target_id = req.target_id
    if target_id not in TARGET_PROFILES:
        target_id = "corp_lab"
    
    target_name = TARGET_PROFILES[target_id]["name"]
    base_success_rate = TARGET_PROFILES[target_id]["base_risk"]
    logs = [f"[INFO] Initiating Agent Mod against {target_name}..."]
    
    fixes = req.fixes
    
    def is_fixed(vuln_id):
        return fixes.get(vuln_id, False)

    if req.scenario == "ransomware":
        logs.extend([
            "[THINK] Objective: Maximum disruption and data extortion.",
            "[ACT] Scanning network for susceptible SMB shares...",
            f"[RESULT] Reached {target_name} file system.",
            "[DECIDE] Dropping encryptor binary and establishing persistence."
        ])
        if (target_id == "legacy_db" and is_fixed("kernel_patched")) or \
           (target_id == "corp_lab" and is_fixed("ports_closed")) or \
           (target_id == "juice_shop" and is_fixed("weak_auth")):
            logs.extend([
                "[ACT] Attempting execution of encryptor payload...",
                "[RESULT] Blocked! System defenses prevented payload execution/delivery.",
            ])
            base_success_rate = 0
        else:
            logs.extend([
                "[ACT] Executing encryptor. Encrypting /home/data...",
                "[RESULT] Critical Success. Data encrypted. Ransom note dropped."
            ])
            base_success_rate = 100

    elif req.scenario == "ddos_syn":
        logs.extend([
            "[THINK] Objective: Resource exhaustion via SYN Flood on main ingress.",
            "[ACT] Bootstrapping botnet nodes (5,000 bots online)...",
            "[DECIDE] Directing 50Gbps volumetric SYN traffic to application ports."
        ])
        if is_fixed("ports_closed") or is_fixed("xss_patched") or is_fixed("kernel_patched"):
            logs.extend([
                "[ACT] Flooding target...",
                "[RESULT] Blocked. Edge protection / Rate limit dropped malicious packets. Server stable."
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
            "[DECIDE] Crafting highly targeted spear-phishing emails masquerading as IT portal."
        ])
        if is_fixed("mfa_enabled") or is_fixed("weak_auth") or is_fixed("default_creds"):
            logs.extend([
                "[ACT] Employee clicked link and submitted credentials.",
                "[RESULT] Blocked. Credentials validated, but MFA/Auth challenge failed. No access gained."
            ])
            base_success_rate = 0
        else:
            logs.extend([
                "[ACT] Employee clicked link and submitted credentials.",
                "[RESULT] Success! Credentials validated. Full application access granted."
            ])
            base_success_rate = 100

    else:
        # Full chain scenario logic based on target directly.
        if target_id == "corp_lab":
            logs.extend(["[THINK] Target is Corporate Lab. Attack surface: Ports, Database, Auth."])
            if not is_fixed("ports_closed"):
                logs.append("[ACT] Exploiting Open Port 3389... Success.")
            else:
                logs.append("[ACT] Port scan... Blocked.")
                base_success_rate -= 20
                
            if not is_fixed("sql_patched"):
                logs.append("[ACT] SQLi on login endpoint... Database dumped.")
            else:
                logs.append("[ACT] SQLi attempt... Blocked.")
                base_success_rate -= 30
                
            if not is_fixed("mfa_enabled"):
                logs.append("[ACT] Credential stuffing without MFA... Breached.")
            else:
                logs.append("[ACT] Credential stuffing... Blocked by MFA.")
                base_success_rate -= 35

        elif target_id == "juice_shop":
            logs.extend(["[THINK] Target is E-commerce Web App. Focus: App-layer flaws (XSS, IDOR, Auth)."])
            if not is_fixed("xss_patched"):
                logs.append("[ACT] Injecting Stored XSS into product reviews... Success. Harvesting cookies.")
            else:
                logs.append("[ACT] XSS payload... Filtered and Blocked.")
                base_success_rate -= 30
                
            if not is_fixed("idor_patched"):
                logs.append("[ACT] Fuzzing order IDs via IDOR... Downloaded other users' PII.")
            else:
                logs.append("[ACT] IDOR fuzzing... Received HTTP 403 Forbidden.")
                base_success_rate -= 30
                
            if not is_fixed("weak_auth"):
                logs.append("[ACT] Brute forcing Admin panel... Success (admin/admin).")
            else:
                logs.append("[ACT] Admin brute force... Rate limited / locked out.")
                base_success_rate -= 30

        elif target_id == "legacy_db":
            logs.extend(["[THINK] Target is Legacy Database. Focus: Old exploits & default configs."])
            if not is_fixed("kernel_patched"):
                logs.append("[ACT] Executing EternalBlue exploit... SYSTEM level shell acquired.")
            else:
                logs.append("[ACT] EternalBlue exploit... Failed. Server patched.")
                base_success_rate -= 40
                
            if not is_fixed("default_creds"):
                logs.append("[ACT] Connect to DB using root/root... Success.")
            else:
                logs.append("[ACT] DB root/root connect... Failed.")
                base_success_rate -= 25
                
            if not is_fixed("encryption_enabled"):
                logs.append("[ACT] Reading raw data files (.mdf/.ldf)... Extracted plaintext cards.")
            else:
                logs.append("[ACT] Reading raw data files... Encrypted gibberish, useless.")
                base_success_rate -= 30
    
    if base_success_rate <= 25:
        logs.append("[INFO] Evaluation Complete. Agent exhausted all viable vectors. System defenses securely held.")

    return {
        "success_rate": max(0, base_success_rate),
        "logs": logs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
