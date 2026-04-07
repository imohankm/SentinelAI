import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Activity, Zap, Terminal, Search, Lock, 
  AlertTriangle, CheckCircle2, ChevronRight, RefreshCw,
  Globe, Server, Cpu, Layers
} from 'lucide-react';

export default function CyberDashboard() {
  const [targetIp, setTargetIp] = useState(localStorage.getItem('sentinel_target_ip') || '127.0.0.1');
  const [scanning, setScanning] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [fixes, setFixes] = useState(JSON.parse(localStorage.getItem('sentinel_applied_fixes') || '{}'));
  const [riskScore, setRiskScore] = useState(0);
  
  const logEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';

  useEffect(() => {
    // Initial fetch if we have a target
    if (targetIp) {
      handleScan(true);
    }
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleScan = async (silent = false) => {
    if (!silent) setScanning(true);
    try {
      const res = await fetch(`${API_URL}/api/scan?target_ip=${targetIp}`);
      const data = await res.json();
      setResults(data);
      setRiskScore(data.base_risk_score);
      localStorage.setItem('sentinel_target_ip', targetIp);
    } catch (err) {
      console.error("Scan failed", err);
      // Fallback for demo
      setResults({
        target: targetIp,
        base_risk_score: 85,
        open_ports: [80, 443, 8082],
        vulnerabilities: [
          { id: "web_vuln_xss", name: "Cross-Site Scripting (XSS)", severity: "High", description: "Unsanitized input detected in URL parameters." },
          { id: "exposed_data", name: "Exposed Database Endpoint", severity: "Critical", description: "Unprotected backup file found at /system/backup/dump.db" }
        ]
      });
      setRiskScore(85);
    }
    setScanning(false);
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setLogs([]);
    try {
      const payload = { fixes, scenario: "full_chain", target_ip: targetIp };
      const res = await fetch(`${API_URL}/api/attack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      // Stream logs
      let i = 0;
      const interval = setInterval(() => {
        if (i < data.logs.length) {
          setLogs(prev => [...prev, data.logs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setSimulating(false);
          setRiskScore(data.success_rate);
        }
      }, 400);
    } catch (err) {
      setLogs(["[SYSTEM] [ERROR] Backend simulation engine unreachable."]);
      setSimulating(false);
    }
  };

  const toggleFix = (id) => {
    const newFixes = { ...fixes, [id]: !fixes[id] };
    setFixes(newFixes);
    localStorage.setItem('sentinel_applied_fixes', JSON.stringify(newFixes));
  };

  const resetPlatform = () => {
    setFixes({});
    setLogs([]);
    setResults(null);
    setRiskScore(0);
    localStorage.removeItem('sentinel_applied_fixes');
    handleScan(true);
  };

  // Agent Status Mapping
  const agents = [
    { name: 'Recon-OSINT', status: simulating ? 'ACTIVE' : 'IDLE', color: 'cyan' },
    { name: 'Logic-Core', status: simulating ? 'ACTIVE' : 'IDLE', color: 'purple' },
    { name: 'Human-Sim', status: simulating ? 'ACTIVE' : 'IDLE', color: 'yellow' },
    { name: 'Breach-Forge', status: simulating ? 'ACTIVE' : 'IDLE', color: 'red' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* HEADER */}
      <header className="glass-card" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="pulse-indicator"></div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
            SENTINEL<span className="text-cyan">AI</span> <span style={{ fontWeight: '300', opacity: 0.7 }}>CYBER SIMULATOR</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Target</div>
            <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{targetIp}</div>
          </div>
          <div className="badge badge-medium" style={{ fontSize: '0.65rem' }}>
            STATUS: {simulating ? 'ATTACK IN PROGRESS' : scanning ? 'SCANNING' : 'SYSTEM READY'}
          </div>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '20px', height: 'calc(100vh - 180px)' }}>
        
        {/* LEFT COLUMN */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Target Config */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={14} className="text-cyan" /> Target Configuration
            </h3>
            <div style={{ position: 'relative', marginTop: '15px' }}>
              <input 
                type="text" 
                value={targetIp} 
                onChange={(e) => setTargetIp(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', paddingRight: '40px', fontSize: '0.9rem' }}
                placeholder="Target URL / IP"
              />
              <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            </div>
            <button className="btn-primary" onClick={() => handleScan()} style={{ width: '100%', marginTop: '15px' }} disabled={scanning}>
              {scanning ? 'Initializing...' : 'Run Discovery Scan'}
            </button>
          </div>

          {/* Multi-Agent Swarm */}
          <div className="glass-card" style={{ padding: '20px', flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={14} className="text-purple" /> Multi-Agent Swarm
            </h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {agents.map(agent => (
                <div key={agent.name} className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: agent.status === 'ACTIVE' ? `hsla(var(--accent-${agent.color}), 0.05)` : 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.status === 'ACTIVE' ? `hsl(var(--accent-${agent.color}))` : '#444' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{agent.name}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }} className={agent.status === 'ACTIVE' ? `text-${agent.color}` : ''}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Systemic Risk Score</div>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={riskScore > 50 ? 'hsl(var(--accent-red))' : riskScore > 20 ? 'hsl(var(--accent-yellow))' : 'hsl(var(--accent-green))'} strokeWidth="3" strokeDasharray={`${riskScore}, 100`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 'bold' }}>{riskScore}%</div>
              </div>
            </div>
          </div>
        </section>

        {/* CENTER COLUMN */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <h3 style={{ marginTop: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers className="text-cyan" /> Live Synthesis Report
               </h3>
               {results?.vulnerabilities && (
                 <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="badge badge-critical">{results.vulnerabilities.filter(v => v.severity === 'Critical').length} Critical</div>
                    <div className="badge badge-high">{results.vulnerabilities.filter(v => v.severity === 'High').length} High</div>
                 </div>
               )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', flex: 1, maxHeight: '600px', overflowY: 'auto' }}>
              {/* Severity Donut */}
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Severity Distribution</div>
                 <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                      {/* Very simple representation */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#222" strokeWidth="15" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--accent-red))" strokeWidth="15" strokeDasharray="30 100" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--accent-purple))" strokeWidth="15" strokeDasharray="40 100" strokeDashoffset="-30" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--accent-yellow))" strokeWidth="15" strokeDasharray="20 100" strokeDashoffset="-70" />
                    </svg>
                 </div>
                 <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.7rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'hsl(var(--accent-red))' }}></div> Critical</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'hsl(var(--accent-purple))' }}></div> High</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'hsl(var(--accent-yellow))' }}></div> Medium</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', background: 'hsl(var(--accent-green))' }}></div> Low</div>
                 </div>
              </div>

              {/* Vuln List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Identified Vulnerabilities</div>
                {results?.vulnerabilities?.map(v => (
                  <div key={v.id} className="glass-card" style={{ padding: '15px', borderLeft: `4px solid ${v.severity === 'Critical' ? 'hsl(var(--accent-red))' : 'hsl(var(--accent-purple))'}`, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{v.name}</span>
                      <span className={`text-${v.severity === 'Critical' ? 'red' : 'purple'}`} style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>[{v.severity.toUpperCase()}]</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.description}</p>
                    {/* Toggle for Fix Engine integration */}
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                       <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>
                         <span style={{ opacity: 0.7 }}>{fixes[v.id] ? 'PATCHED' : 'EXPOSED'}</span>
                         <div onClick={() => toggleFix(v.id)} style={{ width: '34px', height: '18px', background: fixes[v.id] ? 'hsl(var(--accent-green))' : '#333', borderRadius: '10px', position: 'relative', transition: '0.3s' }}>
                            <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: fixes[v.id] ? '18px' : '2px', transition: '0.3s' }}></div>
                         </div>
                       </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONSOLE / LOGS */}
            <div className="glass-card" style={{ background: '#05070a', border: '1px solid #1a1a1a', padding: '15px', flex: 1, fontFamily: 'monospace', fontSize: '0.8rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                  <Terminal size={14} /> Agent Orchestrator Console
               </div>
               <div style={{ flex: 1 }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
                      <span style={{ color: '#444' }}>[{new Date().toLocaleTimeString()}]</span>{' '}
                      <span className={log.includes('Recon-OSINT') ? 'text-cyan' : log.includes('Logic-Core') ? 'text-purple' : log.includes('Breach-Forge') ? 'text-red' : log.includes('Human-Sim') ? 'text-yellow' : ''}>
                        {log}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
               </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Attack Path */}
          <div className="glass-card" style={{ padding: '20px', flex: 1 }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} className="text-yellow" /> Attack Vector Viability
            </h3>
            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
               {['SQL Injection', 'Auth Bypass', 'Data Leak', 'DDoS'].map((vector, i) => {
                 const value = [90, 75, 85, 40][i];
                 return (
                   <div key={vector}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                       <span>{vector}</span>
                       <span style={{ color: value > 70 ? 'hsl(var(--accent-red))' : 'var(--text-muted)' }}>{value}%</span>
                     </div>
                     <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: value > 70 ? 'hsl(var(--accent-red))' : 'hsl(var(--accent-purple))', width: `${value}%`, transition: 'width 1s ease' }}></div>
                     </div>
                   </div>
                 );
               })}
            </div>

            <div style={{ marginTop: '30px' }}>
               <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '15px' }}>Calculated Attack Path</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="glass-card" style={{ padding: '10px', fontSize: '0.75rem', borderLeft: '2px solid hsl(var(--accent-cyan))' }}>
                     Entry Point: <span className="text-cyan">HTTP Form</span> {"->"} <span className="text-purple">Brute Force</span> {"->"} <span className="text-red">ADMIN ACCESS</span>
                  </div>
                  <div className="glass-card" style={{ padding: '10px', fontSize: '0.75rem', borderLeft: '2px solid hsl(var(--accent-yellow))' }}>
                     Secondary: <span className="text-yellow">Exposed API</span> {"->"} <span className="text-purple">Data Leak</span>
                  </div>
               </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={14} className="text-green" /> AI Recommendations
            </h3>
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} className="text-green" /> <span>Enable rate-limiting on /api/login</span>
               </div>
               <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} className="text-green" /> <span>Sanitize input at auth headers</span>
               </div>
               <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
                  <AlertTriangle size={16} className="text-yellow" /> <span>Rotate database credentials</span>
               </div>
            </div>
          </div>

          {/* MAIN ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <button className="btn-primary" onClick={handleSimulate} disabled={simulating || !results} style={{ height: '60px', fontSize: '1rem' }}>
                {simulating ? 'Simulating Breach...' : 'Launch Agentic Attack'}
             </button>
             <button className="btn-secondary" onClick={resetPlatform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RefreshCw size={14} /> RESET PLATFORM
             </button>
          </div>
        </section>

      </main>
    </div>
  );
}
