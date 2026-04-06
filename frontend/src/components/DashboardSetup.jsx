import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Server, Globe } from 'lucide-react'

export default function DashboardSetup() {
  const navigate = useNavigate();
  const [targetIp, setTargetIp] = useState('127.0.0.1');

  const handleInit = (e) => {
    e.preventDefault();
    localStorage.setItem('sentinel_target_ip', targetIp);
    navigate('/scan');
  };

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Server size={48} className="neon-text-cyan" />
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Dynamic <span className="neon-text-cyan">Reconnaissance</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Provide an IPv4 address, hostname, or URL to execute a live vulnerability scan.</p>
        
        <form onSubmit={handleInit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
               <Globe size={18}/> Target IPv4 / URL
            </label>
            <input 
              type="text"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              placeholder="e.g. 192.168.1.5 or localhost"
              style={{ 
                  width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', 
                  border: '1px solid var(--neon-cyan)', color: 'white', 
                  borderRadius: '4px', fontSize: '1.1rem', outline: 'none',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
              }}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            Initialize Live Scan Sequence
          </button>
        </form>
      </div>
    </div>
  )
}
