import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Server, Globe } from 'lucide-react'

export default function DashboardSetup() {
  const navigate = useNavigate();
  const [targetIp, setTargetIp] = useState('127.0.0.1');

  const handleInit = (e) => {
    e.preventDefault();
    localStorage.setItem('sentinel_target_ip', targetIp);
    navigate('/dashboard');
  };

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Server size={48} className="neon-text-cyan" />
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>Dynamic <span className="neon-text-cyan">DAST Configuration</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Define an IPv4 address, hostname, or local URL to initialize the live penetration testing sequence.</p>
        
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

        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Local Lab Quick-Select</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[8080, 8081, 8082].map(port => (
                    <button
                        key={port}
                        onClick={() => {
                            setTargetIp(`127.0.0.1:${port}`);
                        }}
                        style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid var(--neon-cyan)',
                            color: 'var(--neon-cyan)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'}
                    >
                        localhost:{port}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
