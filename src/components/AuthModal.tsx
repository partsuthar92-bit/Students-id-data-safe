import React, { useState } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, AlertCircle, KeyRound, User, School, BookOpen, Globe2 } from 'lucide-react';
import { StudentProfile } from '../types';
import { BOARDS, GRADES, LANGUAGES } from '../data/sampleData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  onLoginSuccess: (student: StudentProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  student,
  onLoginSuccess,
  onLogout,
}) => {
  const [studentIdInput, setStudentIdInput] = useState(student?.id || 'STU1001');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [phoneMask, setPhoneMask] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [grade, setGrade] = useState<number>(student?.grade || 10);
  const [board, setBoard] = useState<string>(student?.board || 'GSEB');
  const [language, setLanguage] = useState<string>(student?.language || 'Gujarati');
  const [school, setSchool] = useState<string>(student?.school || 'Shree Swaminarayan Gurukul');

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentIdInput }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to request OTP');

      setIsOtpSent(true);
      setDebugOtp(data.debugOtp || '123456');
      setPhoneMask(data.student.phone);
      setGrade(data.student.grade || 10);
      setBoard(data.student.board || 'GSEB');
      setSchool(data.student.school || 'Shree Swaminarayan Gurukul');
      setSuccessMsg(`OTP sent to ${data.student.phone}! (Firebase Phone Auth Simulation)`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentIdInput, otp: otpInput }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      const loggedStudent: StudentProfile = {
        ...data.student,
        grade,
        board,
        language,
        school,
        isVerified: true,
      };

      onLoginSuccess(loggedStudent);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      grade,
      board,
      language,
      school,
    };
    onLoginSuccess(updated);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0c1b]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0c1b]/90 backdrop-blur-xl border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Student Firebase Security Auth</h3>
              <p className="text-xs text-slate-300">Student ID Verification & OTP Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {student ? (
            /* Logged In View / Profile Editor */
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{student.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {student.id} | {student.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Grade / Class
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {GRADES.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-400" /> Education Board
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {BOARDS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-indigo-400" /> Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-indigo-400" /> School / Institute Name
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : !isOtpSent ? (
            /* Request OTP Form */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student ID Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. STU1001 or STU1002"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase tracking-wider"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try default IDs: <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => setStudentIdInput('STU1001')}>STU1001</span>, <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => setStudentIdInput('STU1002')}>STU1002</span>, <span className="text-indigo-300 font-semibold cursor-pointer" onClick={() => setStudentIdInput('STU1003')}>STU1003</span>
                </p>
              </div>

              <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 leading-relaxed">
                <span className="font-bold text-white">Firebase Security Check:</span> Requesting OTP will match your Student ID against active Firestore documents and send a 6-digit SMS verification code to your registered mobile phone.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="animate-pulse">Checking Student ID...</span>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Send SMS OTP Verification</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Verify OTP Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs">
                <div className="flex items-center justify-between text-indigo-200">
                  <span>SMS Sent to: <strong className="text-white">{phoneMask}</strong></span>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Change ID
                  </button>
                </div>
                {debugOtp && (
                  <div className="mt-2 pt-2 border-t border-indigo-800/40 flex items-center justify-between">
                    <span className="text-amber-300 font-medium">Demo OTP Code:</span>
                    <span
                      className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono font-bold tracking-widest cursor-pointer hover:bg-amber-500/30"
                      onClick={() => setOtpInput(debugOtp)}
                      title="Click to paste code"
                    >
                      {debugOtp}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="animate-pulse">Verifying OTP...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Login Student</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
