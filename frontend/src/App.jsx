import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DashboardSetup from './components/DashboardSetup'
import VulnerabilityScanner from './components/VulnerabilityScanner'
import LiveSimulation from './components/LiveSimulation'
import FixEngine from './components/FixEngine'
import CyberDashboard from './components/CyberDashboard'
import FinalReport from './components/FinalReport'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardSetup />} />
          <Route path="/dashboard" element={<CyberDashboard />} />
          <Route path="/scan" element={<VulnerabilityScanner />} />
          <Route path="/attack" element={<LiveSimulation />} />
          <Route path="/fix" element={<FixEngine />} />
          <Route path="/report" element={<FinalReport />} />
          {/* Wildcard Redirect to prevent Empty Screens */}
          <Route path="*" element={<DashboardSetup />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
