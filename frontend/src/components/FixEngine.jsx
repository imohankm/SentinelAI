import { useState, useEffect } from 'react'
import { Wrench, ShieldCheck, Activity } from 'lucide-react'

export default function FixEngine() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sqlPatched, setSqlPatched] = useState(false);
  const [portsClosed, setPortsClosed] = useState(false);
  
  const [successRate, setSuccessRate] = useState(85); // Before score
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const payload = { mfa_enabled: mfaEnabled, sql_patched: sqlPatched, ports_closed: portsClosed };
    const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';
    
    fetch(`${API_URL}/api/attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      setSuccessRate(data.success_rate);
      setLoading(false);
    })
    .catch(err => {
      console.error("Backend offline", err);
      // Fallback calculation matching backend logic
      let rate = 85;
      if (portsClosed) rate -= 20;
      if (sqlPatched) rate -= 30;
      if (mfaEnabled) rate -= 15;
      setSuccessRate(Math.max(0, rate));
      setLoading(false);
    });
  }, [mfaEnabled, sqlPatched, portsClosed]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wrench className="neon-text-cyan" /> Auto-Remediation Fix Engine
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Apply fixes in a controlled environment and re-simulate attack instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Fix Toggles</h3>
          
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Close External Ports</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Block traffic to 22 & 3389</p>
              </div>
              <label style={{ display: 'block', width: '60px', height: '30px', background: portsClosed ? 'var(--neon-green)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={portsClosed} onChange={() => setPortsClosed(!portsClosed)} />
                <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: portsClosed ? '32px' : '2px', transition: 'all 0.3s' }}></div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Patch SQL Vuls</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sanitize /api/auth inputs</p>
              </div>
              <label style={{ display: 'block', width: '60px', height: '30px', background: sqlPatched ? 'var(--neon-cyan)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={sqlPatched} onChange={() => setSqlPatched(!sqlPatched)} />
                <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: sqlPatched ? '32px' : '2px', transition: 'all 0.3s' }}></div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Enable MFA</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Require 2FA globally</p>
              </div>
              <label style={{ display: 'block', width: '60px', height: '30px', background: mfaEnabled ? 'var(--neon-purple)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={mfaEnabled} onChange={() => setMfaEnabled(!mfaEnabled)} />
                <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: mfaEnabled ? '32px' : '2px', transition: 'all 0.3s' }}></div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Activity /> Before Vs After Comparison</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '2rem', flex: 1 }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', height: '150px', borderRadius: '50%', 
                border: `8px solid var(--neon-red)`, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 1rem auto', boxShadow: `0 0 20px rgba(239, 68, 68, 0.3)`
              }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>85%</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>Initial Attack Success</span>
            </div>

            <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>➔</div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', height: '150px', borderRadius: '50%', 
                border: `8px solid ${successRate > 50 ? 'var(--neon-red)' : successRate > 20 ? 'var(--neon-purple)' : 'var(--neon-green)'}`, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 1rem auto', boxShadow: `0 0 20px ${successRate > 50 ? 'rgba(239, 68, 68, 0.3)' : successRate > 20 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                transition: 'all 0.5s',
                opacity: loading ? 0.3 : 1
              }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{successRate}%</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>Re-Test Success Rate</span>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '2rem', justifyContent: 'center' }}>
            { successRate < 85 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neon-green)' }}>
                <ShieldCheck size={18} /> Attack Surface Reduced by {85 - successRate}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Output */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-cyan)' }}>Real-World Application Options</h4>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn-primary" disabled={successRate > 20}>Deploy Fixes to Production</button>
           <button className="btn-primary" style={{background: 'rgba(255,255,255,0.1)', border: '1px solid #444', color: 'white'}}>Generate DevOps Ticketing (JIRA)</button>
        </div>
      </div>
    </div>
  )
}
