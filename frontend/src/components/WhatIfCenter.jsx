import { useState } from 'react'
import { ShieldCheck, TrendingDown, Target } from 'lucide-react'

export default function WhatIfCenter() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [trainingEnabled, setTrainingEnabled] = useState(false);

  // Calculate success rate based on toggles
  let currentSuccessRate = 80;
  if (mfaEnabled) currentSuccessRate -= 50;
  if (trainingEnabled) currentSuccessRate -= 15;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck className="neon-text-cyan" /> Defensive What-If Simulator
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Test security policies before deployment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Policy Controls</h3>
          
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Global MFA Enforced</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Require 2FA for all accounts</p>
              </div>
              <label style={{ display: 'block', width: '60px', height: '30px', background: mfaEnabled ? 'var(--neon-cyan)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={mfaEnabled} onChange={() => setMfaEnabled(!mfaEnabled)} />
                <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: mfaEnabled ? '32px' : '2px', transition: 'all 0.3s' }}></div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Mandatory Sec Training</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weekly phishing simulations</p>
              </div>
              <label style={{ display: 'block', width: '60px', height: '30px', background: trainingEnabled ? 'var(--neon-cyan)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={trainingEnabled} onChange={() => setTrainingEnabled(!trainingEnabled)} />
                <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: trainingEnabled ? '32px' : '2px', transition: 'all 0.3s' }}></div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ marginTop: 0 }}>Attack Success Probability</h3>
          </div>
          
          <div style={{ 
            width: '200px', height: '200px', borderRadius: '50%', 
            border: `12px solid ${currentSuccessRate > 50 ? 'var(--neon-red)' : currentSuccessRate > 20 ? 'var(--neon-purple)' : 'var(--neon-cyan)'}`, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            margin: '2rem 0', boxShadow: `0 0 30px ${currentSuccessRate > 50 ? 'rgba(239, 68, 68, 0.5)' : currentSuccessRate > 20 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`,
            transition: 'all 0.5s ease-out'
          }}>
            <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>{currentSuccessRate}%</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
            { currentSuccessRate < 80 && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neon-green)' }}>
                <TrendingDown size={18} /> Risk Reduced by {80 - currentSuccessRate}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Output */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-cyan)' }}>AI Security Recommendations</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>Prioritize enforcing MFA across all departments, particularly Sales.</li>
          <li>Assign remedial Phishing assessment to EMP2.</li>
          <li>Monitor login attempts for EMP2 over the next 7 days for anomalies.</li>
        </ul>
      </div>
    </div>
  )
}
