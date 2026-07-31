import React, { useState } from 'react';
import { X, Bookmark, Trash2, Copy, Check, Download, Search, BookOpen } from 'lucide-react';
import { SavedNote } from '../types';

interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: SavedNote[];
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
}

export const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onDeleteNote,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredNotes = notes.filter((n) =>
    n.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_ai_study_notes_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0c1b]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0c1b]/90 backdrop-blur-xl border border-white/15 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Saved Study Notes & Revision Cards</h3>
              <p className="text-xs text-slate-300">{notes.length} Bookmarked Q&As</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {notes.length > 0 && (
              <button
                onClick={handleExportAll}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/15 flex items-center gap-1 backdrop-blur-md"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Export JSON
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved questions, subjects, formulas..."
              className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredNotes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-semibold text-slate-400">No study notes saved yet.</p>
              <p className="text-[11px] text-slate-500">Bookmark answers in the AI Tutor tab to review them anytime.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-indigo-300">{note.subject}</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-medium">
                      Grade {note.grade} ({note.board})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(note.id, `${note.question}\n\n${note.answer}`)}
                      className="text-slate-400 hover:text-white p-1 rounded"
                      title="Copy Note"
                    >
                      {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-white">Q: {note.question}</div>
                <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {note.answer}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notes.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0 text-xs">
            <span className="text-slate-400">{notes.length} total saved items</span>
            <button
              onClick={onClearAll}
              className="text-rose-400 hover:underline text-xs font-semibold"
            >
              Clear All Notes
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
