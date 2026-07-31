import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Server, 
  Smartphone, 
  ShieldAlert, 
  ShoppingBag,
  ExternalLink,
  Cpu,
  Flame,
  Key
} from 'lucide-react';
import { FASTAPI_CODE, FIREBASE_CODE, FLUTTER_CODE, STORE_COMPLIANCE, TECH_STACK_SUMMARY } from '../data/blueprintData';

export const MasterBlueprintView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'fastapi' | 'firebase' | 'flutter' | 'store'>('fastapi');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const getCodeContent = () => {
    switch (activeCodeTab) {
      case 'fastapi':
        return FASTAPI_CODE;
      case 'firebase':
        return FIREBASE_CODE;
      case 'flutter':
        return FLUTTER_CODE;
      default:
        return '';
    }
  };

  const handleCopyCode = () => {
    const code = getCodeContent();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTab(activeCodeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadCode = () => {
    const code = getCodeContent();
    if (!code) return;

    let filename = 'main.py';
    if (activeCodeTab === 'firebase') filename = 'index.js';
    if (activeCodeTab === 'flutter') filename = 'main.dart';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Blueprint Top Header */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Master Blueprint (માસ્ટર બ્લુપ્રિન્ટ)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Production Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete architectural specs for Python FastAPI backend, Firebase Cloud Functions OTP, Flutter UI, and Play Store release.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition-all"
          >
            {copiedTab === activeCodeTab ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedTab === activeCodeTab ? 'Copied' : 'Copy Active Code'}</span>
          </button>
          <button
            onClick={handleDownloadCode}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tech Stack Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TECH_STACK_SUMMARY.map((item, idx) => (
          <div key={idx} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-indigo-400/40 transition-all space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{item.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-indigo-300 border border-white/15">
                {item.tech.split(' ')[0]}
              </span>
            </div>
            <p className="font-bold text-sm text-white">{item.tech}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Code Viewer Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Code Tabs Header */}
        <div className="bg-[#0a0c1b]/80 p-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1">
            
            <button
              onClick={() => setActiveCodeTab('fastapi')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCodeTab === 'fastapi'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>1. Python FastAPI Backend</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('firebase')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCodeTab === 'firebase'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>2. Firebase Cloud Function</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('flutter')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCodeTab === 'flutter'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>3. Flutter Mobile App UI</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('store')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCodeTab === 'store'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-rose-400" />
              <span>4. App Store Deployment</span>
            </button>

          </div>

          <div className="text-[11px] text-slate-400 font-mono px-2">
            {activeCodeTab === 'fastapi' && 'main.py (Python 3.11+)'}
            {activeCodeTab === 'firebase' && 'index.js (Node.js 18)'}
            {activeCodeTab === 'flutter' && 'lib/main.dart (Flutter 3.x)'}
            {activeCodeTab === 'store' && 'COPPA / FERPA Compliance'}
          </div>
        </div>

        {/* Code View Body */}
        <div className="p-4 bg-[#0a0c1b]/90 font-mono text-xs overflow-x-auto text-slate-200 max-h-[520px]">
          {activeCodeTab === 'store' ? (
            <div className="space-y-6 font-sans text-slate-200 p-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Google Play Store Guidelines (Android)
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  {STORE_COMPLIANCE.playStore.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Apple App Store Guidelines (iOS)
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  {STORE_COMPLIANCE.appStore.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <pre className="text-slate-200 leading-relaxed font-mono">
              <code>{getCodeContent()}</code>
            </pre>
          )}
        </div>

      </div>
    </div>
  );
};
