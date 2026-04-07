import { Link, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Terminal, Settings } from 'lucide-react'

export default function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Configuration', path: '/', icon: <Settings size={18} /> },
    { name: 'Cyber Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Attack Simulation', path: '/attack', icon: <Terminal size={18} /> },
  ];

  return (
    <nav className="navbar" style={{ background: 'hsla(var(--bg-panel), 0.8)', padding: '0.8rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield className="text-cyan" />
        <span style={{ fontWeight: '800', letterSpacing: '-0.5px', color: 'white' }}>SENTINEL<span className="text-cyan">AI</span></span>
      </div>
      
      <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
        {navLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            style={{ 
                color: location.pathname === link.path ? 'hsl(var(--accent-cyan))' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                transition: 'all 0.2s'
            }}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
         <div className="badge badge-medium" style={{ fontSize: '0.65rem' }}>BETA 3.2.0</div>
      </div>
    </nav>
  )
}
