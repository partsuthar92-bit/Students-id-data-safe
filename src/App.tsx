/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AIAssistantView } from './components/AIAssistantView';
import { IDCardScannerView } from './components/IDCardScannerView';
import { TranslatorView } from './components/TranslatorView';
import { MasterBlueprintView } from './components/MasterBlueprintView';
import { SecurityGuardrailsView } from './components/SecurityGuardrailsView';
import { SavedNotesModal } from './components/SavedNotesModal';
import { ActiveTab, StudentProfile, SavedNote } from './types';
import { GraduationCap, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai-assistant');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Default initial logged-in verified student profile
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return {
      id: 'STU1001',
      name: 'Aarav Patel',
      phone: '+91 98765 43210',
      grade: 10,
      board: 'GSEB',
      school: 'Shree Swaminarayan Gurukul',
      language: 'Gujarati',
      isVerified: true,
    };
  });

  // Saved Notes list with localStorage persistence
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    const saved = localStorage.getItem('saved_study_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return [];
  });

  useEffect(() => {
    if (student) {
      localStorage.setItem('student_profile', JSON.stringify(student));
    } else {
      localStorage.removeItem('student_profile');
    }
  }, [student]);

  useEffect(() => {
    localStorage.setItem('saved_study_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const handleSaveNote = (noteData: Omit<SavedNote, 'id' | 'timestamp'>) => {
    const newNote: SavedNote = {
      ...noteData,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSavedNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotes = () => {
    if (confirm('Are you sure you want to clear all saved notes?')) {
      setSavedNotes([]);
    }
  };

  const handleApplyOcrStudentData = (data: Partial<StudentProfile>) => {
    setStudent((prev) => {
      const base = prev || {
        id: 'STU1001',
        name: 'Aarav Patel',
        phone: '+91 98765 43210',
        grade: 10,
        board: 'GSEB',
        school: 'Global Student Academy',
        language: 'Gujarati',
      };
      return {
        ...base,
        ...data,
        isVerified: true,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0c1b] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      
      {/* Ambient Mesh Gradient Blur Orbs for Frosted Glass Backdrop */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Sticky Navigation Header */}
      <div className="relative z-20">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          student={student}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenNotes={() => setIsNotesOpen(true)}
          savedNotesCount={savedNotes.length}
        />
      </div>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {activeTab === 'ai-assistant' && (
          <AIAssistantView
            student={student}
            onSaveNote={handleSaveNote}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'ocr-scanner' && (
          <IDCardScannerView
            onApplyStudentData={handleApplyOcrStudentData}
          />
        )}

        {activeTab === 'translator' && (
          <TranslatorView />
        )}

        {activeTab === 'blueprint' && (
          <MasterBlueprintView />
        )}

        {activeTab === 'security' && (
          <SecurityGuardrailsView />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 text-slate-400 text-xs py-6 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">Global Student AI Assistance Platform</span>
            <span className="text-[10px] text-slate-400">| FastAPI + Gemini Pro + Flutter Master Blueprint</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setActiveTab('blueprint')} className="hover:text-white transition-colors">
              Blueprint Code
            </button>
            <button onClick={() => setActiveTab('security')} className="hover:text-white transition-colors">
              COPPA / FERPA Shield
            </button>
            <button onClick={() => setIsNotesOpen(true)} className="hover:text-white transition-colors">
              Saved Notes ({savedNotes.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        student={student}
        onLoginSuccess={(updatedStudent) => setStudent(updatedStudent)}
        onLogout={() => {
          setStudent(null);
          setIsAuthOpen(false);
        }}
      />

      <SavedNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={savedNotes}
        onDeleteNote={handleDeleteNote}
        onClearAll={handleClearAllNotes}
      />

    </div>
  );
}
