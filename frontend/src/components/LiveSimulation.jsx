import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, ShieldAlert } from 'lucide-react'

export default function LiveSimulation() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const script = [
      "[INFO] Initializing Autonomous Red Team Agents...",
      "[RECON] Scanning external attack surface for XYZ Tech.",
      "[RECON] Evaluating employee behavioral profiles and digital footprints.",
      "[RECON] Identified target: EMP2 (Sales) - high propensity for clicking external links.",
      "[STRATEGY] Formulating Attack Path -> Payload: Phishing_v2.",
      "[ATTACK] Delivering payload to EMP2 email inbox.",
      "[ATTACK] Target opened email. Link clicked. C2 connection established.",
      "[EXPLOIT] Harvesting credentials. Lateral movement initiated...",
      "[CRITICAL] Credentials compromised. Core network access achieved."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < script.length) {
        setLogs(prev => [...prev, script[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setFinished(true);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert className="neon-text-red" /> Live Attack Simulation
        </h2>
        {finished && (
          <button className="btn-primary" onClick={() => navigate('/risk')}>
             Proceed to Risk Analysis
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
         <div className="glass-panel" style={{ padding: '2rem', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: finished ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)', transition: 'all 2s' }}>
            <div style={{ opacity: finished ? 1 : 0.1, transition: 'opacity 1s', textAlign: 'center' }}>
                <ShieldAlert size={100} className="neon-text-red" />
                <h2 className="neon-text-red">SYSTEM BREACHED</h2>
                <p style={{ color: 'var(--text-muted)' }}>Vector: Human Interaction (Phishing)</p>
            </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem', background: '#09090b', fontFamily: 'monospace', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
              <Terminal size={18} /> Engine Output
            </div>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                color: log?.includes('CRITICAL') || log?.includes('ATTACK') ? 'var(--neon-red)' : 
                       log?.includes('RECON') ? 'var(--neon-cyan)' : 
                       log?.includes('STRATEGY') ? 'var(--neon-purple)' : 'var(--text-main)',
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
