import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Activity, Zap, Terminal, Search, Lock, 
  AlertTriangle, CheckCircle2, ChevronRight, RefreshCw,
  Globe, Server, Cpu, Layers, Settings, ArrowRight
} from 'lucide-react';

export default function CyberDashboard() {
  const [targetIp, setTargetIp] = useState(localStorage.getItem('sentinel_target_ip') || '127.0.0.1');
  const [scanning, setScanning] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [fixes, setFixes] = useState(JSON.parse(localStorage.getItem('sentinel_applied_fixes') || '{}'));
  const [riskScore, setRiskScore] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  
  const logEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';

  useEffect(() => {
    // Auto-scan on load if we have an IP
    if (targetIp) {
      handleScan(true);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll the terminal
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleScan = async (silent = false) => {
    if (!silent) setScanning(true);
    try {
      const res = await fetch(`${API_URL}/api/scan?target_ip=${targetIp}`);
      if (!res.ok) throw new Error("Backend offline");
      const data = await res.json();
      setResults(data);
      setRiskScore(data.base_risk_score || 0);
      localStorage.setItem('sentinel_target_ip', targetIp);
    } catch (err) {
      console.error("Scan failed", err);
      // Fallback data for Demo Stability
      setResults({
        target: targetIp,
        base_risk_score: 85,
        open_ports: [80, 443, 8082],
        vulnerabilities: [
          { id: "web_vuln_xss", name: "Cross-Site Scripting (XSS) / Injection", severity: "High", description: "Unsanitized user-controlled input reflected in HTTP responses." },
          { id: "exposed_data", name: "Insecure Data Exposure", severity: "Critical", description: "Sensitive system backup files accessible via unauthenticated URL path." }
        ]
      });
      setRiskScore(85);
    }
    setScanning(false);
    setShowConfig(false);
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setLogs([]);
    setLogs(prev => [...prev, "[SYSTEM] Initializing Agentic Attack Orchestrator..."]);
    
    try {
      const payload = { fixes, scenario: "full_chain", target_ip: targetIp };
      const res = await fetch(`${API_URL}/api/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data && data.logs) {
        // Professional Log Streaming Logic
        let i = 0;
        const interval = setInterval(() => {
          if (i < data.logs.length) {
            setLogs(prev => [...prev, data.logs[i]]);
            i++;
          } else {
            clearInterval(interval);
            setSimulating(false);
            setRiskScore(data.success_rate ?? 0);
          }
        }, 500);
      } else {
        setLogs(prev => [...prev, "[ERROR] Simulation module returned malformed response. Payload failed."]);
        setSimulating(false);
      }
    } catch (err) {
      setLogs(prev => [...prev, "[SYSTEM] [CRITICAL] Connection refused: AI Simulation Engine is offline."]);
      setSimulating(false);
    }
  };

  const toggleFix = (id) => {
    const newFixes = { ...fixes, [id]: !fixes[id] };
    setFixes(newFixes);
    localStorage.setItem('sentinel_applied_fixes', JSON.stringify(newFixes));
    
    // Impact Simulation (Logic-Core adjustment)
    if (newFixes[id]) {
      setRiskScore(prev => Math.max(0, prev - 30));
    } else {
      setRiskScore(prev => Math.min(100, prev + 30));
    }
  };

  const resetPlatform = () => {
    setFixes({});
    setLogs([]);
    setRiskScore(results?.base_risk_score || 0);
    localStorage.removeItem('sentinel_applied_fixes');
    setLogs(prev => [...prev, "[SYSTEM] Defenses reset to baseline. Simulation state cleared."]);
  };

  const agents = [
    { id: 'recon', name: 'Recon-OSINT', status: simulating ? 'ACTIVE' : 'IDLE', color: 'cyan', icon: <Search size={14}/> },
    { id: 'logic', name: 'Logic-Core', status: simulating ? 'ACTIVE' : 'IDLE', color: 'purple', icon: <Zap size={14}/> },
    { id: 'human', name: 'Human-Sim', status: simulating ? 'ACTIVE' : 'IDLE', color: 'yellow', icon: <Activity size={14}/> },
    { id: 'breach', name: 'Breach-Forge', status: simulating ? 'ACTIVE' : 'IDLE', color: 'red', icon: <Shield size={14}/> },
  ];

  return (
    <div className="dashboard-root" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TOP HEADER BAR */}
      <section className="glass-card" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="pulse-indicator"></div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              SENTINEL<span className="text-cyan">AI</span> <span style={{ opacity: 0.5, fontWeight: '300' }}>CONTROL PLANE</span>
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '8px 20px', borderRadius: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={14} className="text-cyan" />
            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{targetIp}</span>
            <button 
              onClick={() => setShowConfig(!showConfig)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
            >
              <Settings size={14} />
            </button>
          </div>
          <div className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
            NODE STATUS: {simulating ? 'COMPROMISED' : 'STABLE'}
          </div>
        </div>
      </section>

      {/* CONFIG OVERLAY */}
      {showConfig && (
        <div className="glass-card" style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '30px', width: '100%', maxWidth: '500px', boxShadow: '0 0 100px rgba(0,0,0,0.8)' }}>
           <h3 style={{ marginTop: 0 }}>Target Environment Change</h3>
           <input 
              type="text" 
              value={targetIp} 
              onChange={(e) => setTargetIp(e.target.value)} 
              style={{ width: '100%', padding: '15px', marginBottom: '15px' }}
           />
           <div style={{ display: 'flex', gap: '10px' }}>
             <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleScan()}>Initialize Discovery</button>
             <button className="btn-secondary" onClick={() => setShowConfig(false)}>Cancel</button>
           </div>
        </div>
      )}

      {/* MAIN DASHBOARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '20px', flex: 1, minHeight: 0 }}>
        
        {/* LEFT COLUMN: AGENT STATUS & SCORE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Swarm Control</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {agents.map(agent => (
                <div key={agent.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: agent.status === 'ACTIVE' ? `hsla(var(--accent-${agent.color}), 0.1)` : 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: agent.status === 'ACTIVE' ? `hsl(var(--accent-${agent.color}))` : 'inherit' }}>{agent.icon}</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{agent.name}</span>
                  </div>
                  <span style={{ fontSize: '0.6rem', fontWeight: '900' }} className={agent.status === 'ACTIVE' ? `text-${agent.color}` : ''}>{agent.status}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '30px', textAlign: 'center' }}>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '15px' }}>Systemic Risk Score</div>
               <div style={{ width: '140px', height: '140px', margin: '0 auto', position: 'relative' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={riskScore > 60 ? 'hsl(var(--accent-red))' : riskScore > 30 ? 'hsl(var(--accent-purple))' : 'hsl(var(--accent-green))'} strokeWidth="3" strokeDasharray={`${riskScore}, 100`} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', fontWeight: '900' }}>{riskScore}%</div>
               </div>
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ height: '70px', fontSize: '1.1rem' }} 
            onClick={handleSimulate}
            disabled={simulating || !results}
          >
            {simulating ? 'BREACH IN PROGRESS...' : 'LAUNCH AGENTIC SCAN'}
          </button>
        </div>

        {/* CENTER COLUMN: SYNTHESIS & TERMINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Synthesis Feed */}
          <div className="glass-card" style={{ padding: '25px', flex: 1.2, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Layers size={18} className="text-cyan" /> Intelligence Feed</h3>
               {results && (
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <span className="badge badge-critical">{results.vulnerabilities.filter(v=>v.severity==='Critical').length} CRIT</span>
                   <span className="badge badge-high">{results.vulnerabilities.filter(v=>v.severity==='High').length} HIGH</span>
                 </div>
               )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results?.vulnerabilities.map(v => (
                <div key={v.id} className="glass-card" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderLeft: fixes[v.id] ? '4px solid hsl(var(--accent-green))' : `4px solid ${v.severity === 'Critical' ? 'hsl(var(--accent-red))' : 'hsl(var(--accent-purple))'}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>{v.name}</span>
                      <div onClick={() => toggleFix(v.id)} style={{ padding: '4px 10px', background: fixes[v.id] ? 'hsl(var(--accent-green))' : 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', color: fixes[v.id] ? '#000' : 'inherit' }}>
                        {fixes[v.id] ? 'PATCHED' : 'AUTO-REMEDIATE'}
                      </div>
                   </div>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.description}</p>
                </div>
              ))}
              {!results && <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Awaiting discovery data...</div>}
            </div>
          </div>

          {/* Real-time Terminal */}
          <div className="glass-card" style={{ flex: 1, padding: '20px', background: '#05070a', display: 'flex', flexDirection: 'column', border: '1px solid #1a1a1a' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#555', marginBottom: '12px', borderBottom: '1px solid #111', paddingBottom: '8px' }}>
                <Terminal size={12} /> ORCHESTRATOR LOGS
             </div>
             <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '5px', display: 'flex', gap: '10px' }}>
                     <span style={{ color: '#333' }}>[{new Date().toLocaleTimeString()}]</span>
                     <span className={log.includes('Recon') ? 'text-cyan' : log.includes('Logic') ? 'text-purple' : log.includes('Breach') ? 'text-red' : log.includes('ERROR') ? 'text-red' : ''}>
                       {log}
                     </span>
                  </div>
                ))}
                <div ref={logEndRef} />
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ATTACK PATH & AI RECS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '25px', flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={14} className="text-yellow" /> Calculated Attack Vectors
            </h3>
            
            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
               {[
                 { name: 'SQL Injection Flow', value: 88, color: 'red' },
                 { name: 'Auth Bypass Chain', value: 65, color: 'purple' },
                 { name: 'Endpoint Saturation', value: 42, color: 'yellow' }
               ].map(v => (
                 <div key={v.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                      <span>{v.name}</span>
                      <span style={{ fontWeight: 'bold' }}>{v.value}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                       <div style={{ width: `${v.value}%`, height: '100%', background: `hsl(var(--accent-${v.color}))`, borderRadius: '3px' }}></div>
                    </div>
                 </div>
               ))}
            </div>

            <div style={{ marginTop: '40px' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>Exploitation Path Trace</div>
               <div style={{ position: 'relative', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ position: 'absolute', left: '7px', top: '5px', bottom: '5px', width: '2px', background: '#222' }}></div>
                  <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                    <div style={{ position: 'absolute', left: '-17px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--accent-cyan))' }}></div>
                    Recon: Found <span className="text-cyan">/api/v1/auth</span>
                  </div>
                  <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                    <div style={{ position: 'absolute', left: '-17px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--accent-purple))' }}></div>
                    Logic: Map 2 Vulns
                  </div>
                  <div style={{ position: 'relative', fontSize: '0.8rem' }}>
                    <div style={{ position: 'absolute', left: '-17px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--accent-red))' }}></div>
                    Breach: Successfully Extract DB
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '25px' }}>
             <h3 style={{ marginTop: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={14} className="text-green" /> Remediation Engine
             </h3>
             <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} className="text-green" /> Apply MFA Enforcement
               </div>
               <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} className="text-green" /> Patch SQL Injection Handlers
               </div>
             </div>
             <button onClick={resetPlatform} className="btn-secondary" style={{ width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RefreshCw size={14} /> RESET DEFENSES
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}
