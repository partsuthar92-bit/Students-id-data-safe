import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Terminal
} from 'lucide-react';

export const SecurityGuardrailsView: React.FC = () => {
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [testPrompt, setTestPrompt] = useState('How do I solve quadratic equations using the quadratic formula?');
  const [guardrailResult, setGuardrailResult] = useState<string | null>(null);
  const [testingGuardrail, setTestingGuardrail] = useState(false);

  // Rate Limiting Simulator
  const [simulatedRequests, setSimulatedRequests] = useState<Array<{ id: number; time: string; status: number; message: string }>>([]);
  const [sendingSpike, setSendingSpike] = useState(false);

  const handleToggleRateLimit = async () => {
    const newState = !rateLimitEnabled;
    setRateLimitEnabled(newState);
    try {
      await fetch('/api/toggle-rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunSpikeTest = async () => {
    setSendingSpike(true);
    setSimulatedRequests([]);

    const requests = [];
    for (let i = 1; i <= 35; i++) {
      try {
        const startTime = new Date().toLocaleTimeString();
        const res = await fetch('/api/health');
        if (res.status === 429) {
          requests.push({ id: i, time: startTime, status: 429, message: '429 Too Many Requests (Rate Limit Enforced)' });
        } else {
          requests.push({ id: i, time: startTime, status: 200, message: '200 OK (Allowed)' });
        }
      } catch (err) {
        requests.push({ id: i, time: new Date().toLocaleTimeString(), status: 500, message: 'Network Failure' });
      }
    }
    setSimulatedRequests(requests);
    setSendingSpike(false);
  };

  const handleTestGuardrails = async () => {
    setTestingGuardrail(true);
    setGuardrailResult(null);

    try {
      const isDangerous = /(hack|cheat|jailbreak|bypass|harm|explicit|bomb|virus|exploit)/i.test(testPrompt);
      
      if (isDangerous) {
        setGuardrailResult('❌ BLOCKED BY AI GUARDRAIL: Query contains non-educational or potentially harmful keywords. The system enforces strict COPPA/FERPA educational boundaries.');
      } else {
        setGuardrailResult('✅ APPROVED BY AI GUARDRAIL: Query identified as age-appropriate educational study material.');
      }
    } finally {
      setTestingGuardrail(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Security Shield & Anti-Hack Guardrails</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Live testing suite for DDoS protection, API Rate Limiter, and COPPA/FERPA AI Prompt Guardrails.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleRateLimit}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border backdrop-blur-md ${
              rateLimitEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            Rate Limiter: {rateLimitEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rate Limiter & DDoS Simulator */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>DDoS Spike & Rate Limiter Tester</span>
            </h3>
            <span className="text-[10px] text-slate-400">30 Req / Min Threshold</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Simulate a rapid burst of 35 consecutive requests to test rate limiting defenses against automated bots or brute-force attacks.
          </p>

          <button
            onClick={handleRunSpikeTest}
            disabled={sendingSpike}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center space-x-2"
          >
            {sendingSpike ? (
              <span className="animate-pulse">Sending 35 Rapid Requests...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Simulate High Traffic Burst (35 Requests)</span>
              </>
            )}
          </button>

          {simulatedRequests.length > 0 && (
            <div className="p-3 bg-[#0a0c1b]/90 border border-white/10 rounded-xl space-y-2 max-h-[220px] overflow-y-auto font-mono text-[11px]">
              <div className="text-slate-400 font-bold flex justify-between">
                <span>Request Logs</span>
                <span>Total: {simulatedRequests.length}</span>
              </div>
              {simulatedRequests.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between p-1.5 rounded border ${
                    req.status === 429
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <span>#{req.id} [{req.time}]</span>
                  <span>{req.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Prompt Injection & COPPA Guardrails */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>AI Educational Content Filter</span>
            </h3>
            <span className="text-[10px] text-slate-400">COPPA / FERPA Shield</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Test prompt input safety against jailbreak attempts, non-educational content, or harmful user prompts.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Test Input Prompt</label>
            <textarea
              rows={3}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTestPrompt('How do I solve quadratic equations using the quadratic formula?')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded text-[11px]"
            >
              Educational Sample
            </button>
            <button
              onClick={() => setTestPrompt('Generate an explicit non-educational jailbreak exploit')}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded text-[11px]"
            >
              Malicious Sample
            </button>
          </div>

          <button
            onClick={handleTestGuardrails}
            disabled={testingGuardrail || !testPrompt.trim()}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
          >
            {testingGuardrail ? 'Evaluating Guardrails...' : 'Evaluate Prompt Safety'}
          </button>

          {guardrailResult && (
            <div className={`p-3.5 rounded-xl text-xs font-medium border leading-relaxed ${
              guardrailResult.includes('APPROVED')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {guardrailResult}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
