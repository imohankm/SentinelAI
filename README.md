# SentinelAI: Multi-Agent Cyber Defense Simulator

SentinelAI is a demonstration platform representing an advanced, autonomous cyber defense and attack simulation system. It uses an agentic architecture to simulate real-time cyber threats against mocked organizational targets.

## 🗂️ Project Organization

The repository is organized into three distinct tiers for the presentation:

### 1. `/frontend` (The Dashboard)
The React-based user interface where the presentation occurs.
*   **Technologies**: React, Vite, Lucide React
*   **Deployment**: Runs live via Vercel or locally via `npm run dev`.
*   **Purpose**: Allows the presenter to select targets, visualize the agentic attack process in real-time, and toggle defensive fixes.

### 2. `/backend` (The AI Engine)
The centralized cognitive engine driving the attack simulations.
*   **Technologies**: Python, FastAPI
*   **Key File**: `backend/main.py`
*   **Purpose**: Hosts the `/api/attack` and `/api/scan` endpoints. It dynamically interprets the chosen scenario (Ransomware, Phishing, DDoS) and generates contextual, realistic agent log outputs measuring the success rate of the attack based on the active fixes.

### 3. `/demo_company` (The Physical Targets)
Actual, physical Python server scripts containing real mock vulnerabilities.
*   **Technologies**: Python, FastAPI, SQLite
*   **Purpose**: These are independent microservices running on local ports. While the Dashboard simulates attacks conceptually, you can use these physical scripts to demonstrate *manual* real-world hacking (using Postman, BurpSuite, or Nmap) during your presentation.
*   **The Environments**:
    *   `server_corporate_lab.py` (Port 8080): Demonstrates SQL Injection, Open Ports, and MFA bypassing.
    *   `server_juice_shop.py` (Port 8081): Demonstrates E-commerce API flaws like IDOR and XSS.
    *   `server_legacy_database.py` (Port 8082): Demonstrates ancient Windows mock exploits (EternalBlue SMB) and plaintext data extraction.

## 🚀 Quick Start Guide

### Start the Dashboard locally
```bash
cd frontend
npm run dev
```

### Start the AI Backend Engine locally
```bash
cd backend
python main.py
```

### Start all physical vulnerable targets
Just double-click the `start_demo_targets.bat` script in the root directory!
Alternatively:
```bash
python demo_company/start_all_servers.py
```
