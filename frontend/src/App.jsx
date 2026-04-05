import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DashboardSetup from './components/DashboardSetup'
import DigitalTwinMap from './components/DigitalTwinMap'
import LiveSimulation from './components/LiveSimulation'
import RiskAnalysis from './components/RiskAnalysis'
import WhatIfCenter from './components/WhatIfCenter'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardSetup />} />
          <Route path="/twin" element={<DigitalTwinMap />} />
          <Route path="/simulation" element={<LiveSimulation />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/whatif" element={<WhatIfCenter />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
