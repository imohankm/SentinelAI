import React, { useState } from 'react';
import { Shield, Fingerprint, Key, Clock, Users, Mail, AlertTriangle, FileText, Activity, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('identity');
  
  // State for all toggles
  const [policies, setPolicies] = useState({
    "Password + Fingerprint Login": true,
    "OTP + Brute-force Protection": true,
    "Company Email Verification": false,
    "Session Clearing": true,
    "Admin ID with 30-day Expiry": false,
    "5-day Expiry Warning": true,
    "Auto Update Next Admin ID": false,
    "Admin Member Management": true,
    "Alert if Too Many Members": true,
    "Phishing Detection": false,
    "Antivirus Risk Check": true,
    "File Protection (Popup Warn)": false,
    "Alerts for Valid Users": true
  });

  const togglePolicy = (key) => {
    setPolicies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const identityFeatures = [
    { name: "Password + Fingerprint Login", activeStatus: "Secured", icon: <Fingerprint size={20} className="text-gray-400" /> },
    { name: "OTP + Brute-force Protection", activeStatus: "Active", icon: <Key size={20} className="text-gray-400" /> },
    { name: "Company Email Verification", activeStatus: "Required", icon: <Mail size={20} className="text-gray-400" /> },
    { name: "Session Clearing", activeStatus: "Automated", icon: <Clock size={20} className="text-gray-400" /> }
  ];

  const adminFeatures = [
    { name: "Admin ID with 30-day Expiry", activeStatus: "Enforced", icon: <Shield size={20} className="text-gray-400" /> },
    { name: "5-day Expiry Warning", activeStatus: "Monitored", icon: <AlertTriangle size={20} className="text-gray-400" /> },
    { name: "Auto Update Next Admin ID", activeStatus: "Enabled", icon: <Activity size={20} className="text-gray-400" /> },
    { name: "Admin Member Management", activeStatus: "Verified", icon: <Users size={20} className="text-gray-400" /> },
    { name: "Alert if Too Many Members", activeStatus: "Active", icon: <AlertTriangle size={20} className="text-gray-400" /> }
  ];

  const threatFeatures = [
    { name: "Phishing Detection", activeStatus: "Scanning", icon: <AlertTriangle size={20} className="text-gray-400" /> },
    { name: "Antivirus Risk Check", activeStatus: "Operational", icon: <Shield size={20} className="text-gray-400" /> },
    { name: "File Protection (Popup Warn)", activeStatus: "Enabled", icon: <FileText size={20} className="text-gray-400" /> },
    { name: "Alerts for Valid Users", activeStatus: "Logging", icon: <Activity size={20} className="text-gray-400" /> }
  ];

  const renderList = (features) => (
    <div className="grid gap-4 mt-4">
      {features.map((f, i) => {
        const isActive = policies[f.name];
        return (
          <div key={i} className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${isActive ? 'bg-[#111] border-[#333]' : 'bg-[#0a0a0c] border-[#222]'}`} onClick={() => togglePolicy(f.name)}>
            <div className="flex items-center gap-4">
              <div style={{ color: isActive ? '#06b6d4' : '#666' }}>
                {f.icon}
              </div>
              <div>
                <div className={isActive ? "text-gray-200 font-semibold" : "text-gray-500"}>{f.name}</div>
                <div className="text-xs mt-1" style={{ color: isActive ? '#10b981' : '#ed333b' }}>
                  {isActive ? f.activeStatus : 'Disabled'}
                </div>
              </div>
            </div>
            
            <div>
              {isActive ? 
                <ToggleRight size={32} className="text-cyan-500" /> : 
                <ToggleLeft size={32} className="text-gray-600" />
              }
            </div>
          </div>
        )
      })}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 m-0 text-white">
            <Shield className="neon-text-cyan" /> Identity & Compliance Hub
          </h2>
          <p className="text-gray-400 mt-2">Dynamically manage zero-trust policies, IAM, and enforce active threat monitoring.</p>
        </div>
        
        <button 
          className="btn-primary flex gap-2 items-center" 
          onClick={() => {
            const allEnabled = Object.keys(policies).reduce((acc, key) => ({...acc, [key]: true}), {});
            setPolicies(allEnabled);
          }}
        >
          <CheckCircle2 size={18} /> Enforce All Policies
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-[#333] pb-2">
        <button 
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2 font-semibold ${activeTab === 'identity' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Access & Identity
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2 font-semibold ${activeTab === 'admin' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Admin & Governance
        </button>
        <button 
          onClick={() => setActiveTab('threats')}
          className={`px-4 py-2 font-semibold ${activeTab === 'threats' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Threat Intelligence
        </button>
      </div>

      <div className="glass-panel p-6" style={{ background: '#09090b', minHeight: '400px' }}>
        {activeTab === 'identity' && renderList(identityFeatures)}
        {activeTab === 'admin' && renderList(adminFeatures)}
        {activeTab === 'threats' && renderList(threatFeatures)}
      </div>
    </div>
  );
}
