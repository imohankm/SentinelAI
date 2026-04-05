import { useNavigate } from 'react-router-dom'

export default function DashboardSetup() {
  const navigate = useNavigate();

  const handleInit = (e) => {
    e.preventDefault();
    navigate('/twin');
  };

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Deploy Your <span className="neon-text-cyan">Digital Twin</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure organizational simulation parameters.</p>
        
        <form onSubmit={handleInit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Organization Name</label>
            <input type="text" placeholder="XYZ Tech" required defaultValue="XYZ Tech" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Employee Count</label>
            <select>
              <option>1 - 50</option>
              <option selected>5 - 10</option>
              <option>50 - 250</option>
              <option>250+</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Base Security Posture</label>
            <input type="range" min="1" max="10" defaultValue="4" />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Initialize Twin
          </button>
        </form>
      </div>
    </div>
  )
}
