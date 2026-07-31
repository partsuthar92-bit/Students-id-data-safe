import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Scan, 
  Languages, 
  Code2, 
  ShieldCheck, 
  Bookmark, 
  UserCheck, 
  LogIn,
  SlidersHorizontal
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  student: StudentProfile | null;
  onOpenAuth: () => void;
  onOpenNotes: () => void;
  savedNotesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenAuth,
  onOpenNotes,
  savedNotesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ai-assistant')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/80 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0c1b]/90 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Global Student AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-indigo-300 border border-white/15">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Master Blueprint & Multi-Language AI Tutor
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ai-assistant'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Learning Companion</span>
            </button>

            <button
              onClick={() => setActiveTab('ocr-scanner')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ocr-scanner'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Scan className="w-4 h-4 text-cyan-400" />
              <span>OCR ID & Homework</span>
            </button>

            <button
              onClick={() => setActiveTab('translator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'translator'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>Translator</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'blueprint'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Master Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Security Shield</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Bookmarks */}
            <button
              onClick={onOpenNotes}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors"
              title="Saved Study Notes"
            >
              <Bookmark className="w-5 h-5" />
              {savedNotesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedNotesCount}
                </span>
              )}
            </button>

            {/* Student Auth Button */}
            {student ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{student.id}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                  Gr {student.grade}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Student Login</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0a0c1b]/80 backdrop-blur-xl border-t border-white/10 px-2 py-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'ai-assistant' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>AI Tutor</span>
        </button>
        <button
          onClick={() => setActiveTab('ocr-scanner')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'ocr-scanner' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Scan className="w-4 h-4 mb-0.5" />
          <span>OCR ID</span>
        </button>
        <button
          onClick={() => setActiveTab('translator')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'translator' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Languages className="w-4 h-4 mb-0.5" />
          <span>Translate</span>
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'blueprint' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-4 h-4 mb-0.5" />
          <span>Blueprint</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === 'security' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Security</span>
        </button>
      </div>
    </header>
  );
};
