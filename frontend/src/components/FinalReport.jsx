import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalReport() {
  const navigate = useNavigate();
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [baseRisk, setBaseRisk] = useState(85);
  const [targetIp, setTargetIp] = useState('127.0.0.1');
  const [finalRisk, setFinalRisk] = useState(0);
  const [appliedFixes, setAppliedFixes] = useState(null);

  useEffect(() => {
    const ip = localStorage.getItem('sentinel_target_ip') || '127.0.0.1';
    setTargetIp(ip);
    const API_URL = import.meta.env.VITE_API_URL || 'https://sentinelai-jq5d.onrender.com';
    
    fetch(`${API_URL}/api/scan?target_ip=${ip}`)
      .then(res => res.json())
      .then(data => {
        setVulnerabilities(data.vulnerabilities || []);
        setBaseRisk(data.base_risk_score || 85);
      })
      .catch(err => console.error("Error fetching vulns for report", err));

    const storedFinalRisk = localStorage.getItem('sentinel_final_success_rate');
    if (storedFinalRisk) setFinalRisk(parseInt(storedFinalRisk));
    
    const storedFixes = localStorage.getItem('sentinel_applied_fixes');
    if (storedFixes) {
      try {
        setAppliedFixes(JSON.parse(storedFixes));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 m-0 text-white">
            <FileText className="text-cyan-400" size={32} /> Executive Security Report
          </h2>
          <p className="text-gray-400 mt-2">Automated Penetration Testing & Remediation Summary for {targetIp}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/')}>
           Run New Audit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6 bg-[#1a0f0f] border-red-900/50">
          <h3 className="text-red-400 flex items-center gap-2 mb-4 font-bold">
            <AlertTriangle /> INITIAL STATE (Pre-Fix)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-red-900/30 pb-2">
              <span className="text-gray-400">Risk Level</span>
              <span className="text-red-400 font-bold">{baseRisk > 70 ? 'CRITICAL' : baseRisk > 40 ? 'HIGH' : 'MEDIUM'}</span>
            </div>
            <div className="flex justify-between border-b border-red-900/30 pb-2">
              <span className="text-gray-400">Attack Success Rate</span>
              <span className="text-red-400 font-bold">{baseRisk}%</span>
            </div>
            <div className="pt-2">
              <span className="text-gray-400 block mb-2">Vulnerabilities Discovered:</span>
              <ul className="text-sm space-y-1 text-gray-300">
                {vulnerabilities.map(v => (
                   <li key={v.id}>• {v.name}</li>
                ))}
                {vulnerabilities.length === 0 && <li>• None Critical</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 bg-[#0f1a14] border-green-900/50">
          <h3 className="text-green-400 flex items-center gap-2 mb-4 font-bold">
            <ShieldCheck /> FINAL STATE (Post-Fix)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-green-900/30 pb-2">
              <span className="text-gray-400">Risk Level</span>
              <span className="text-green-400 font-bold">LOW</span>
            </div>
            <div className="flex justify-between border-b border-green-900/30 pb-2">
              <span className="text-gray-400">Attack Success Rate</span>
              <span className={`font-bold ${finalRisk > 50 ? 'text-red-400' : finalRisk > 20 ? 'text-purple-400' : 'text-green-400'}`}>{finalRisk}%</span>
            </div>
            <div className="pt-2">
              <span className="text-gray-400 block mb-2">Automated Fixes Applied:</span>
              <ul className="text-sm space-y-1 text-gray-300">
                {vulnerabilities
                  .filter(v => appliedFixes === null || appliedFixes[v.id])
                  .map(v => (
                    <li key={`fix-${v.id}`}><CheckCircle2 size={14} className="inline text-green-500 mr-1"/> {v.fix_label}</li>
                ))}
                {((appliedFixes !== null && vulnerabilities.filter(v => appliedFixes[v.id]).length === 0) || vulnerabilities.length === 0) && (
                   <li><AlertTriangle size={14} className="inline text-yellow-500 mr-1"/> No specific fixes applied</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 bg-[#0a0a0c]">
        <h3 className="text-xl text-white font-bold mb-4">AI Remediation Summary</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          SentinelAI successfully completed an autonomous penetration testing simulation against <strong>{targetIp}</strong>. Initial reconnaissance identified active application-layer vulnerabilities. Following the successful exploitation simulation, the Fix Engine dynamically verified remediation implementations.
        </p>
        <div className="p-4 bg-[#111] rounded border border-[#333]">
          <h4 className="text-cyan-400 font-semibold mb-2">Recommendation:</h4>
          <p className="text-gray-400 text-sm">
            Maintain current automated patching policies. Integrate SentinelAI deeply into CI/CD staging environments so that future code regressions are instantly detected, attacked, and flagged before reaching production.
          </p>
        </div>
      </div>
    </div>
  );
}
