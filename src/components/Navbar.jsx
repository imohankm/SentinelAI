import { NavLink } from 'react-router-dom'
import { Shield, Activity, Users, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield className="neon-text-cyan" size={28} />
        <h2 style={{ margin: 0, letterSpacing: '2px' }}>SENTINEL<span className="neon-text-cyan">AI</span></h2>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          Setup
        </NavLink>
        <NavLink to="/twin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={18} /> Twin
        </NavLink>
        <NavLink to="/simulation" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Activity size={18} /> Simulation
        </NavLink>
        <NavLink to="/risk" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <AlertTriangle size={18} /> Risk Map
        </NavLink>
        <NavLink to="/whatif" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <ShieldCheck size={18} /> What-If
        </NavLink>
      </div>
    </nav>
  )
}
