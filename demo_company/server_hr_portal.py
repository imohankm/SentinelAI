from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import uvicorn
import time

app = FastAPI(title="Acme HR Portal")

@app.get("/")
def read_root():
    return {"message": "Acme Internal HR Portal"}

# VULNERABILITY 1: Unrestricted File Upload
@app.post("/api/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    # Accepts ANY file extension, allowing potential Reverse Shell uploads (e.g. .php, .py, .sh)
    if not file.filename:
        return {"status": "error", "message": "No file sent"}
    
    # In a real vulnerable app, it would save it to a public /uploads directory
    return {
        "status": "success", 
        "message": f"Successfully uploaded {file.filename}! Stored at /public/uploads/resumes/{file.filename}",
        "vulnerability_trigger": "unrestricted_file_upload" if file.filename.endswith((".php", ".py", ".sh", ".exe")) else "none"
    }

class AuthRequest(BaseModel):
    pin: str

# VULNERABILITY 2: No Rate Limiting on Authentication
@app.post("/api/admin/verify_pin")
def verify_pin(req: AuthRequest):
    # No sleep, no IP tracking, no lockout. Allows thousands of requests per second.
    if req.pin == "8492": # Hardcoded vulnerable PIN
        return {"status": "success", "message": "Admin authenticated"}
    return {"status": "error", "message": "Invalid PIN"}

if __name__ == "__main__":
    uvicorn.run("server_hr_portal:app", host="0.0.0.0", port=8083, reload=False)
