import React from 'react';
import { FileText, ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalReport() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2 m-0 text-white">
            <FileText className="text-cyan-400" size={32} /> Executive Security Report
          </h2>
          <p className="text-gray-400 mt-2">Automated Penetration Testing & Remediation Summary</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/')}>
          Start New Audit
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
              <span className="text-red-400 font-bold">CRITICAL</span>
            </div>
            <div className="flex justify-between border-b border-red-900/30 pb-2">
              <span className="text-gray-400">Attack Success Rate</span>
              <span className="text-red-400 font-bold">85%</span>
            </div>
            <div className="pt-2">
              <span className="text-gray-400 block mb-2">Vulnerabilities Exploited:</span>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Blind SQL Injection (/api/auth)</li>
                <li>• Missing MFA Policies</li>
                <li>• Open RDP Port (3389)</li>
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
              <span className="text-green-400 font-bold">20%</span>
            </div>
            <div className="pt-2">
              <span className="text-gray-400 block mb-2">Automated Fixes Applied:</span>
              <ul className="text-sm space-y-1 text-gray-300">
                <li><CheckCircle2 size={14} className="inline text-green-500 mr-1"/> Parametrized DB Queries</li>
                <li><CheckCircle2 size={14} className="inline text-green-500 mr-1"/> Strict Multi-Factor Auth</li>
                <li><CheckCircle2 size={14} className="inline text-green-500 mr-1"/> Lateral Ports Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 bg-[#0a0a0c]">
        <h3 className="text-xl text-white font-bold mb-4">AI Remediation Summary</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          SentinelAI successfully completed an autonomous penetration testing simulation against the target environment. Initial reconnaissance identified critical network and application-layer vulnerabilities. Following the successful exploitation simulation, SentinelAI dynamically deployed "Zero-Trust" configuration templates.
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
