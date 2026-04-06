import { NavLink } from 'react-router-dom'
import { Shield, Server, Search, Activity, Wrench } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield className="neon-text-cyan" size={28} />
        <h2 style={{ margin: 0, letterSpacing: '2px' }}>SENTINEL<span className="neon-text-cyan">AI</span></h2>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Server size={18} /> Lab Setup
        </NavLink>
        <NavLink to="/scan" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Search size={18} /> Scan
        </NavLink>
        <NavLink to="/attack" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Activity size={18} /> Attack
        </NavLink>
        <NavLink to="/fix" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Wrench size={18} /> Fix Engine
        </NavLink>
      </div>
    </nav>
  )
}
