# SentinelAI: Live DAST & Defense Platform

SentinelAI is an advanced **Dynamic Application Security Testing (DAST)** platform and mock cyber-defense simulator. Rather than relying on static scripts, SentinelAI features a live Python-native port scanner that dynamically interrogates targets, identifies vulnerabilities, and suggests automated remediation code snippets.

## 🗂️ Project Organization

The repository is organized into three distinct tiers for presentation:

### 1. `/frontend` (The Dashboard)
The React-based user interface where the presentation occurs.
*   **Technologies**: React, Vite, Lucide React
*   **Deployment**: Runs live via Vercel or locally via `npm run dev`.
*   **Purpose**: Allows the presenter to target IP addresses/URLs, visualize live vulnerability scanning, execute modular attack simulations against open ports, and deploy code-level fixes with live "Before & After" success rate tracking.

### 2. `/backend` (The AI Engine & Scanner)
The intelligent engine driving the reconnaissance and attack simulations.
*   **Technologies**: Python, FastAPI, slowapi (Rate Limiting)
*   **Security**: Self-hardened with strict `slowapi` rate limits and `SecurityHeadersMiddleware` to block XSS and DDoS on its own APIs!
*   **Purpose**: Hosts `/api/attack` and `/api/scan`. Features a native Python `socket` scanner (`scanner.py`) to bypass the need for external Nmap installations on Windows, enabling highly reliable, ultra-fast port scanning and HTTP header analysis.

### 3. `/demo_company` (The Physical Targets)
Actual, physical Python server scripts containing real mock vulnerabilities.
*   **Technologies**: Python, FastAPI, SQLite
*   **Purpose**: Independent microservices running on local ports. Use SentinelAI to dynamically scan these local targets (`127.0.0.1`), or use them for manual hacking (via BurpSuite/Postman) during your presentation.
*   **The Environments**:
    *   `server_corporate_lab.py` (Port 8080): Demonstrates SQL Injection, Open Ports.
    *   `server_juice_shop.py` (Port 8081): Demonstrates E-commerce API flaws (Open Web).
    *   `server_legacy_database.py` (Port 8082): Demonstrates Legacy Databases exposing internal ports.

## 🚀 Quick Start Guide

### Start the Dashboard locally
```bash
cd frontend
npm run dev
```

### Start the Live Scanner Backend locally
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Start the Vulnerable Targets
Double-click `start_demo_targets.bat` in the root directory!
Alternatively:
```bash
python demo_company/start_all_servers.py
```
*Once running, navigate to the SentinelAI frontend and type `localhost` into the scanner entry field!*
