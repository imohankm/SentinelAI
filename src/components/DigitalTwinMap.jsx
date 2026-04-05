import { useNavigate } from 'react-router-dom'
import { Server, User, UserX } from 'lucide-react'

export default function DigitalTwinMap() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Organization Digital Twin</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Behavioral Profiles Synced</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/simulation')}>
          Run Autonomous Attack Simulation
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', height: '600px', position: 'relative' }}>
           {/* Mock Network Graph */}
           <div style={{ position: 'absolute', top: '20%', left: '40%', textAlign: 'center' }}>
             <Server size={64} className="neon-text-cyan" />
             <p>Core System</p>
           </div>
           
           <div style={{ position: 'absolute', top: '60%', left: '20%', textAlign: 'center', color: 'var(--neon-green)' }}>
             <User size={48} />
             <p>EMP1 (Admin)<br/><small>Status: Secure</small></p>
           </div>

           <div style={{ position: 'absolute', top: '50%', left: '70%', textAlign: 'center', color: 'var(--neon-red)' }}>
             <UserX size={48} />
             <p>EMP2 (Sales)<br/><small>Status: Vulnerable</small></p>
           </div>
           
           {/* Connecting Lines SVG */}
           <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
             <line x1="45%" y1="35%" x2="25%" y2="55%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
             <line x1="45%" y1="35%" x2="75%" y2="45%" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="5,5" />
           </svg>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Twin Insights</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '1rem' }}><strong>EMP1</strong> shows standard administrative patterns. Zero anomalies detected.</li>
            <li style={{ marginBottom: '1rem', color: 'var(--neon-red)' }}><strong>EMP2</strong> has a historically high click rate on emails (78% failure rate in simulated phishing).</li>
            <li>System endpoints properly patched. Human element isolated as primary attack vector.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
