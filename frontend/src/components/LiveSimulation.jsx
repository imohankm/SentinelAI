import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Activity, ShieldAlert, Wifi, Users, Globe } from 'lucide-react'

export default function LiveSimulation() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [finished, setFinished] = useState(false);
  const [successRate, setSuccessRate] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("full_chain");

  const startSimulation = () => {
    setHasStarted(true);
    const targetIp = localStorage.getItem('sentinel_target_ip') || '127.0.0.1';
    const appliedFixes = JSON.parse(localStorage.getItem('sentinel_applied_fixes') || '{}');
    const payload = { fixes: appliedFixes, scenario: selectedScenario, target_ip: targetIp };
    const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';
    
    fetch(`${API_URL}/api/attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      setSuccessRate(data.success_rate);
      let currentLog = 0;
      const interval = setInterval(() => {
        if (currentLog < data.logs.length) {
          setLogs(prev => [...prev, data.logs[currentLog]]);
          currentLog++;
        } else {
          clearInterval(interval);
          setFinished(true);
        }
      }, 700);
      return () => clearInterval(interval);
    })
    .catch(err => {
      console.error("Backend offline", err);
      // Fallback
      setFinished(true);
      setSuccessRate(85);
      setLogs(["[ERROR] Backend offline. Assumed Critical Breach."]);
    });
  };

  const scenarios = [
    { id: "full_chain", title: "Automated Payload Chain", icon: <Globe size={32} />, desc: "Execute a multi-stage autonomous recon and exploit chain against all discovered open ports." },
    { id: "ransomware", title: "Data Persistence Test", icon: <ShieldAlert size={32} />, desc: "Test system resilience against unauthorized binary execution and file-system persistence attempts." },
    { id: "ddos_syn", title: "SYN Flood Resilience", icon: <Wifi size={32} />, desc: "Measure how your network ingress handles high-volume TCP SYN packet saturation." },
    { id: "phishing", title: "Auth-Bypass Simulation", icon: <Users size={32} />, desc: "Test if exposed web-auth services can be bypassed via credential-harvesting logic." }
  ];

  if (!hasStarted) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '2.5rem', marginBottom: '1rem' }}>
            <Activity className="neon-text-red" size={36} /> Select Attack Scenario
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            Choose an attack vector to simulate against the demo environment.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {scenarios.map(s => (
            <div 
              key={s.id} 
              className="glass-panel hover-glow"
              style={{ 
                padding: '2rem', 
                cursor: 'pointer', 
                border: selectedScenario === s.id ? '2px solid var(--neon-red)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedScenario === s.id ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              onClick={() => setSelectedScenario(s.id)}
            >
              <div style={{ 
                color: selectedScenario === s.id ? 'var(--neon-red)' : 'var(--text-muted)', 
                marginBottom: '1rem',
                transition: 'color 0.3s ease'
              }}>
                {s.icon}
              </div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={startSimulation} 
            style={{ 
              padding: '1.2rem 3rem', 
              fontSize: '1.2rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'var(--neon-red)',
              color: 'var(--neon-red)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Initiate Attack Sequence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity className="neon-text-red" /> {scenarios.find(s => s.id === selectedScenario)?.title || "Attack Simulation"}
        </h2>
        {finished && (
          <button className="btn-primary" onClick={() => navigate('/fix')}>
             Proceed to Fix Engine
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
         <div className="glass-panel" style={{ padding: '2rem', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: finished && successRate > 50 ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)', transition: 'all 2s' }}>
            <div style={{ opacity: finished ? 1 : 0.1, transition: 'opacity 1s', textAlign: 'center' }}>
                <div style={{
                  width: '200px', height: '200px', borderRadius: '50%',
                  border: '12px solid var(--neon-red)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto',
                  boxShadow: '0 0 40px rgba(239, 68, 68, 0.5)'
                }}>
                  <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{successRate !== null ? successRate : '--'}%</span>
                </div>
                <h2 className="neon-text-red">ATTACK SUCCESS RATE</h2>
                <p style={{ color: 'var(--text-muted)' }}>Target system severely compromised.</p>
            </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem', background: '#09090b', fontFamily: 'monospace', overflowY: 'auto', height: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
              <Terminal size={18} /> Autonomous Agent Output
            </div>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                color: log?.includes('RESULT') && log?.includes('Success') ? 'var(--neon-red)' : 
                       log?.includes('RESULT') && log?.includes('Blocked') ? 'var(--neon-green)' : 
                       log?.includes('ACT') ? 'var(--neon-cyan)' : 
                       log?.includes('DECIDE') ? 'var(--neon-purple)' : 
                       log?.includes('THINK') ? 'var(--text-muted)' : 'var(--text-main)',
                marginBottom: '10px',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                <span style={{color: '#666', marginRight: '10px'}}>{new Date().toISOString().split('T')[1].substring(0, 8)}</span> {log}
              </div>
            ))}
            {!finished && <div style={{ color: 'var(--neon-cyan)', marginTop: '10px' }}>_</div>}
         </div>
      </div>
    </div>
  )
}
