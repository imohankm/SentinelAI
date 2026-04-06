import React, { useState } from 'react';
import { Shield, Fingerprint, Key, Clock, Users, Mail, AlertTriangle, FileText, Activity } from 'lucide-react';

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('identity');

  const identityFeatures = [
    { name: "Password + Fingerprint Login", status: "Secured", icon: <Fingerprint size={20} className="text-green-400" /> },
    { name: "OTP + Brute-force Protection", status: "Active", icon: <Key size={20} className="text-green-400" /> },
    { name: "Company Email Verification", status: "Required", icon: <Mail size={20} className="text-green-400" /> },
    { name: "Session Clearing", status: "Automated", icon: <Clock size={20} className="text-green-400" /> }
  ];

  const adminFeatures = [
    { name: "Admin ID with 30-day Expiry", status: "Enforced", icon: <Shield size={20} className="text-purple-400" /> },
    { name: "5-day Expiry Warning", status: "Monitored", icon: <AlertTriangle size={20} className="text-yellow-400" /> },
    { name: "Auto Update Next Admin ID", status: "Enabled", icon: <Activity size={20} className="text-blue-400" /> },
    { name: "Admin Member Management", status: "Verified", icon: <Users size={20} className="text-blue-400" /> },
    { name: "Alert if Too Many Members", status: "Active", icon: <AlertTriangle size={20} className="text-yellow-400" /> }
  ];

  const threatFeatures = [
    { name: "Phishing Detection", status: "Scanning", icon: <AlertTriangle size={20} className="text-red-400" /> },
    { name: "Antivirus Risk Check", status: "Operational", icon: <Shield size={20} className="text-green-400" /> },
    { name: "File Protection (Popup Warn)", status: "Enabled", icon: <FileText size={20} className="text-blue-400" /> },
    { name: "Alerts for Valid Users", status: "Logging", icon: <Activity size={20} className="text-purple-400" /> }
  ];

  const renderList = (features) => (
    <div className="grid gap-4 mt-4">
      {features.map((f, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#111] rounded-lg border border-[#333]">
          <div className="flex items-center gap-3">
            {f.icon}
            <span className="text-gray-200">{f.name}</span>
          </div>
          <span className="text-sm font-semibold px-3 py-1 bg-[#222] rounded-full text-gray-300">
            {f.status}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 m-0 text-white">
            <Shield className="text-blue-500" /> Identity & Compliance Hub
          </h2>
          <p className="text-gray-400 mt-2">Managing zero-trust policies, IAM, and active threat monitoring.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-[#333] pb-2">
        <button 
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2 font-semibold ${activeTab === 'identity' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Access & Identity
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2 font-semibold ${activeTab === 'admin' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Admin & Governance
        </button>
        <button 
          onClick={() => setActiveTab('threats')}
          className={`px-4 py-2 font-semibold ${activeTab === 'threats' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}
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
