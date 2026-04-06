import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Activity } from 'lucide-react'

export default function LiveSimulation() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [finished, setFinished] = useState(false);
  const [successRate, setSuccessRate] = useState(null);

  useEffect(() => {
    // Fetch initial attack without fixes
    const payload = { mfa_enabled: false, sql_patched: false, ports_closed: false };
    
    fetch('http://localhost:8000/api/attack', {
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
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity className="neon-text-red" /> Agentic Attack Simulation
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

         <div className="glass-panel" style={{ padding: '1.5rem', background: '#09090b', fontFamily: 'monospace', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
              <Terminal size={18} /> Autonomous Agent Output
            </div>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                color: log?.includes('CRITICAL') || log?.includes('ATTACK') ? 'var(--neon-red)' : 
                       log?.includes('RECON') ? 'var(--neon-cyan)' : 
                       log?.includes('EXPLOIT') ? 'var(--neon-purple)' : 'var(--text-main)',
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
