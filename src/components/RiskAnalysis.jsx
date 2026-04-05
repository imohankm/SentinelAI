import { useNavigate } from 'react-router-dom'
import { AlertCircle, Target, Shield } from 'lucide-react'

export default function RiskAnalysis() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Human Risk Profiler</h2>
        <button className="btn-primary" onClick={() => navigate('/whatif')} style={{marginLeft: "auto"}}>
          Explore What-If Scenarios
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><AlertCircle className="neon-text-red" /> High Risk Target: EMP2</h3>
           
           <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center' }}>
             <div style={{ 
               width: '120px', height: '120px', borderRadius: '50%', 
               border: '8px solid var(--neon-red)', display: 'flex', 
               alignItems: 'center', justifyContent: 'center', fontSize: '2rem', 
               fontWeight: 'bold', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)', flexShrink: 0 
             }}>
               82%
             </div>
             <div>
               <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-muted)' }}>Risk Contributors</h4>
               <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: '1.6' }}>
                 <li>Historically high Phishing click rate.</li>
                 <li>Repeatedly bypasses standard protocols.</li>
                 <li>Unusual login times recorded last week.</li>
               </ul>
             </div>
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Target className="neon-text-purple" /> Threat Prediction Engine</h3>
          
          <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)', marginTop: '2rem' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--neon-purple)' }}>Next Likely Attack Vector</h4>
            <p style={{ margin: 0, fontSize: '1.2rem' }}>Spear Phishing targeting Sales Department</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
              <div style={{ flex: 1, background: '#333', height: '8px', borderRadius: '4px' }}>
                <div style={{ width: '78%', background: 'var(--neon-purple)', height: '100%', borderRadius: '4px', boxShadow: '0 0 10px var(--neon-purple)' }}></div>
              </div>
              <span style={{ fontWeight: 'bold' }}>78% Probability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
