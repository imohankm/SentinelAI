from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uvicorn
import base64

app = FastAPI(title="Acme Legacy Database")

class ExecPayload(BaseModel):
    payload: str

@app.get("/")
def read_root():
    return {"message": "Acme Database Server v1.0 (Windows Server 2008)"}

# VULNERABILITY 1: Simulated Unauthenticated RCE (EternalBlue mock)
@app.post("/system/smb/exploit")
def mock_eternalblue(payload: ExecPayload):
    # This simulates a successful buffer overflow leading to shellcode execution
    if "shell" in payload.payload.lower() or "cmd" in payload.payload.lower():
        return {
            "status": "system_compromised", 
            "shell_output": "Microsoft Windows [Version 6.1.7601]\nCopyright (c) 2009 Microsoft Corporation. All rights reserved.\n\nC:\\Windows\\system32>"
        }
    return {"status": "error", "details": "SMB mapping failed"}

# VULNERABILITY 2: Default Credentials
@app.get("/db/connect")
def db_connect(user: str = "guest", pwd: str = "guest"):
    if user == "root" and pwd == "root":
        return {"status": "success", "db_version": "MySQL 5.5", "tables": ["users", "financials", "audit_logs"]}
    return {"status": "access_denied"}

# VULNERABILITY 3: Insecure Storage (Unencrypted DB Dump)
@app.get("/system/backup/dump.db")
def download_backup():
    # Simulates returning an unencrypted raw sqlite/mdf file
    db_content = "CREATE TABLE users; INSERT INTO users VALUES ('admin', 'plaintext_password_123'); CC: 4111222233334444;"
    encoded = base64.b64encode(db_content.encode()).decode()
    return {"status": "success", "file": "dump.db", "base64_data": encoded}

if __name__ == "__main__":
    uvicorn.run("server_legacy_database:app", host="0.0.0.0", port=8082, reload=False)
