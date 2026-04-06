import socket
import concurrent.futures
import requests
import urllib.parse

# Common ports mapped to likely services for the demo context
PORTS_TO_SCAN = {
    21: "FTP",
    22: "SSH",
    80: "HTTP",
    443: "HTTPS",
    445: "SMB",
    3306: "MySQL",
    3389: "RDP",
    8080: "HTTP (Custom API)",
    8081: "HTTP (E-commerce)",
    8082: "Custom Legacy Service",
    8083: "HTTP (HR Portal)"
}

def scan_port(ip, port, timeout=0.5):
    """Attempt to connect to a specific port on the target IP."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((ip, port))
            if result == 0:
                return port, True
            return port, False
    except Exception:
        return port, False

def infer_vulnerabilities(open_ports):
    """
    Given a list of open ports, generate a list of actionable vulnerabilities.
    This replaces the static profiles from the old main.py.
    """
    vulnerabilities = []
    base_risk = 0
    
    if 22 in open_ports or 3389 in open_ports:
        vulnerabilities.append({
            "id": "open_admin_ports",
            "name": "Administrative Ports Exposed",
            "severity": "Medium",
            "description": "Ports (SSH/RDP) are exposed directly to the network without a bastion host.",
            "fix_label": "Configure Firewall Rules",
            "fix_snippet": "iptables -A INPUT -p tcp --dport 22 -j DROP\n# OR use UFW:\nufw deny 22"
        })
        base_risk += 30

    http_ports = [p for p in open_ports if p in [80, 443, 8080, 8081, 8083]]
    if http_ports:
        vulnerabilities.append({
            "id": "web_vuln_xss",
            "name": "Potential XSS & Injection",
            "severity": "High",
            "description": f"HTTP services detected on {http_ports}. Input forms may lack sanitization.",
            "fix_label": "Implement Input Sanitization",
            "fix_snippet": "// Node.js Express Example:\nconst sanitize = require('dompurify');\n// Strip bad tags\nlet safeHtml = sanitize(userInput);"
        })
        vulnerabilities.append({
            "id": "web_vuln_auth",
            "name": "Lack of Strict Auth / Rate Limiting",
            "severity": "High",
            "description": "Exposed web APIs often lack robust rate-limiting against brute force attacks.",
            "fix_label": "Implement Rate Limiting",
            "fix_snippet": "from fastapi import Request\nfrom slowapi import Limiter\n\nlimiter = Limiter(key_func=get_remote_address)\n@app.get('/login')\n@limiter.limit('5/minute')\ndef login(request: Request):..."
        })
        base_risk += 40

    data_ports = [p for p in open_ports if p in [3306, 8082, 445]]
    if data_ports:
        vulnerabilities.append({
            "id": "exposed_data",
            "name": "Exposed Data Tier / Legacy Services",
            "severity": "Critical",
            "description": f"Data or legacy services (Ports {data_ports}) are network accessible.",
            "fix_label": "Bind to Localhost",
            "fix_snippet": "# /etc/mysql/my.cnf\n[mysqld]\nbind-address = 127.0.0.1\n# Restart target service"
        })
        base_risk += 30
        
    if not vulnerabilities:
         # Fallback if no specific demo ports are open
         vulnerabilities.append({
            "id": "generic_patching",
            "name": "Unverified OS Patches",
            "severity": "Low",
            "description": "No immediate critical ports found, but OS level patching cannot be verified remotely.",
            "fix_label": "Routine System Update",
            "fix_snippet": "sudo apt-get update && sudo apt-get upgrade -y"
         })
         base_risk = 15

    # Cap base risk at 95 for realism
    return min(95, base_risk), vulnerabilities


def run_live_scan(target_ip: str):
    """
    Main entrypoint. Resolves host, concurrent scans the standard ports,
    and returns dynamically generated vulnerabilities.
    """
    # Clean up URIs to raw domains/IPs
    clean_ip = target_ip
    if '://' in clean_ip:
        clean_ip = urllib.parse.urlparse(clean_ip).netloc
    if ':' in clean_ip:
        clean_ip = clean_ip.split(':')[0]
        
    try:
        # Resolve hostname to IP safely
        ip = socket.gethostbyname(clean_ip)
    except socket.gaierror:
        # If it's totally invalid, we fallback softly
        ip = clean_ip
        
    open_ports = []
    
    # Run rapid concurrent socket testing
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_port = {executor.submit(scan_port, ip, port): port for port in PORTS_TO_SCAN.keys()}
        for future in concurrent.futures.as_completed(future_to_port):
            port, is_open = future.result()
            if is_open:
                open_ports.append(port)
                
    base_risk, vulnerabilities = infer_vulnerabilities(open_ports)
    
    return {
        "target": target_ip,
        "resolved_ip": ip,
        "open_ports": open_ports,
        "base_risk_score": base_risk,
        "vulnerabilities": vulnerabilities
    }
