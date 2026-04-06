import { useNavigate } from 'react-router-dom'

export default function DashboardSetup() {
  const navigate = useNavigate();

  const handleInit = (e) => {
    e.preventDefault();
    navigate('/scan');
  };

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Setup <span className="neon-text-cyan">Simulated Server</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Provision a mock environment for authorized penetration testing.</p>
        
        <form onSubmit={handleInit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Environment</label>
            <select style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>
              <option>OWASP Juice Shop (Web)</option>
              <option>DVWA (Damn Vulnerable Web App)</option>
              <option>Corporate Internal Lab XYZ</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Default Posture</label>
            <select style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', borderRadius: '4px' }}>
              <option>Vulnerable (No Defenses)</option>
              <option>Hardened (Out-of-box security)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Initialize Lab & Connect
          </button>
        </form>
      </div>
    </div>
  )
}
