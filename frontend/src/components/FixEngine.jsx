import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, ShieldCheck, Activity } from 'lucide-react'

export default function FixEngine() {
  const [fixes, setFixes] = useState({});
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [baseRisk, setBaseRisk] = useState(85);
  
  const [successRate, setSuccessRate] = useState(85);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleJira = () => {
    setToast("JIRA API: Created Epic SEC-404 spanning required security patches.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeploy = () => {
    setToast("Deploying configuration changes via simulated CI/CD...");
    setTimeout(() => {
        navigate('/report');
    }, 2000);
  };

  useEffect(() => {
    const targetIp = localStorage.getItem('sentinel_target_ip') || '127.0.0.1';
    const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';
    
    fetch(`${API_URL}/api/scan?target_ip=${targetIp}`)
      .then(res => res.json())
      .then(data => {
        setVulnerabilities(data.vulnerabilities || []);
        setBaseRisk(data.base_risk_score || 85);
        setSuccessRate(data.base_risk_score || 85);
      })
      .catch(err => console.error("Error fetching vulns for fix engine", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const targetIp = localStorage.getItem('sentinel_target_ip') || '127.0.0.1';
    const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';
    const payload = { fixes: fixes, scenario: "full_chain", target_ip: targetIp };
    
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
      // Fallback calculation matching backend logic simply
      let rate = baseRisk;
      Object.keys(fixes).forEach(k => {
        if (fixes[k]) rate -= 25; // Simple fallback math
      });
      setSuccessRate(Math.max(0, rate));
      setLoading(false);
    });
  }, [fixes, baseRisk]);

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
          <h3 style={{ marginTop: 0 }}>Active Threat Defenses</h3>
          
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {vulnerabilities.map(vuln => (
              <div key={vuln.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: fixes[vuln.id] ? '4px solid var(--neon-green)' : '4px solid var(--text-muted)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: fixes[vuln.id] ? 'var(--neon-green)' : 'white' }}>{vuln.fix_label}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{vuln.description}</p>
                  </div>
                  <label style={{ display: 'block', width: '60px', height: '30px', background: fixes[vuln.id] ? 'var(--neon-green)' : '#333', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
                    <input type="checkbox" style={{ display: 'none' }} checked={!!fixes[vuln.id]} onChange={() => setFixes({...fixes, [vuln.id]: !fixes[vuln.id]})} />
                    <div style={{ width: '26px', height: '26px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: fixes[vuln.id] ? '32px' : '2px', transition: 'all 0.3s' }}></div>
                  </label>
                </div>
                {vuln.fix_snippet && (
                    <div style={{ background: '#09090b', padding: '1rem', borderRadius: '4px', border: '1px solid #333' }}>
                        <pre style={{ margin: 0, color: fixes[vuln.id] ? 'var(--text-muted)' : 'var(--neon-cyan)', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                            <code>{vuln.fix_snippet}</code>
                        </pre>
                    </div>
                )}
              </div>
            ))}
            {vulnerabilities.length === 0 && <p style={{color: 'var(--text-muted)'}}>Loading defenses...</p>}
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
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{baseRisk}%</span>
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
            { successRate < baseRisk && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neon-green)' }}>
                <ShieldCheck size={18} /> Attack Surface Reduced by {baseRisk - successRate}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommended Output */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-cyan)' }}>Real-World Application Options</h4>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn-primary" disabled={successRate > 25} onClick={handleDeploy}>Deploy Fixes to Production</button>
           <button className="btn-primary" style={{background: 'rgba(255,255,255,0.1)', border: '1px solid #444', color: 'white'}} onClick={handleJira}>Generate DevOps Ticketing (JIRA)</button>
        </div>
      </div>

      {toast && (
          <div style={{
              position: 'fixed', bottom: '20px', right: '20px', 
              background: 'var(--neon-green)', color: 'black', 
              padding: '1rem 2rem', borderRadius: '8px', 
              fontWeight: 'bold', boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
              zIndex: 1000
          }}>
              {toast}
          </div>
      )}
    </div>
  )
}
