import subprocess
import sys
import time

def main():
    print("[*] Booting Acme Corp Virtual Infrastructure...")
    
    # List of server scripts to run
    servers = [
        {"file": "server.py", "port": 8080, "name": "Main Demo API"},
        {"file": "server_ecommerce.py", "port": 8081, "name": "E-Commerce Web App"},
        {"file": "server_legacy.py", "port": 8082, "name": "Legacy DB Server"},
        {"file": "server_hr_portal.py", "port": 8083, "name": "HR Portal"}
    ]
    
    processes = []
    
    try:
        for s in servers:
            print(f"[+] Starting {s['name']} on Port {s['port']}...")
            # Use sys.executable to run with the current python interpreter
            p = subprocess.Popen([sys.executable, s["file"]])
            processes.append(p)
            time.sleep(1) # Slight delay to avoid console output overlapping too much
            
        print("\n=======================================================")
        print("[*] All targets are live and vulnerable!")
        print("[*] Press Ctrl+C to shut down the entire infrastructure.")
        print("=======================================================\n")
        
        # Keep the main thread alive so the children keep running
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n[*] Shutting down all servers...")
        for p in processes:
            p.terminate()
        print("[*] Infrastructure offline.")

if __name__ == "__main__":
    main()
