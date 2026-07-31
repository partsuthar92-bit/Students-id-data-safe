import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  X, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Bookmark, 
  BookOpen, 
  Lightbulb, 
  RotateCcw,
  Zap,
  Globe2,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { AnswerType, StudentProfile, SavedNote } from '../types';
import { BOARDS, GRADES, LANGUAGES, SUBJECTS, SUGGESTED_PROMPTS } from '../data/sampleData';

interface AIAssistantViewProps {
  student: StudentProfile | null;
  onSaveNote: (note: Omit<SavedNote, 'id' | 'timestamp'>) => void;
  onOpenAuth: () => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  student,
  onSaveNote,
  onOpenAuth,
}) => {
  const [grade, setGrade] = useState<number>(student?.grade || 10);
  const [board, setBoard] = useState<string>(student?.board || 'GSEB');
  const [language, setLanguage] = useState<string>(student?.language || 'Gujarati');
  const [subject, setSubject] = useState<string>('Mathematics');
  const [answerType, setAnswerType] = useState<AnswerType>('step_by_step');
  
  const [question, setQuestion] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Audio Speech state
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition setup (Voice Input)
  const handleToggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language for recognition
      if (language === 'Gujarati') recognition.lang = 'gu-IN';
      else if (language === 'Hindi') recognition.lang = 'hi-IN';
      else if (language === 'Spanish') recognition.lang = 'es-ES';
      else if (language === 'French') recognition.lang = 'fr-FR';
      else recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Prompt to Server API
  const handleSubmitPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() && !imageBase64) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setSaved(false);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student?.id || 'GUEST',
          grade,
          board,
          subject,
          question: question.trim(),
          answer_type: answerType,
          language,
          imageBase64: imageBase64 || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate answer.');

      setResponse(data.response);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI engine.');
    } finally {
      setLoading(false);
    }
  };

  // Text To Speech Audio Playback
  const handleToggleAudioTTS = () => {
    if (!response) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(response.replace(/[#*`_]/g, ''));
    if (language === 'Gujarati') utterance.lang = 'gu-IN';
    else if (language === 'Hindi') utterance.lang = 'hi-IN';
    else if (language === 'Spanish') utterance.lang = 'es-ES';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Response
  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save Note
  const handleSaveNoteClick = () => {
    if (!response) return;
    onSaveNote({
      question: question || 'Homework Image Analysis',
      answer: response,
      subject,
      grade,
      board,
      answerType,
      language,
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Student Context Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Smart AI Learning Companion</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/15">
                Grade {grade} ({board})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Personalized tutoring with step-by-step math, science, and exam revision guides.
            </p>
          </div>
        </div>

        {/* Quick Student Bar Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 font-medium flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" /> {language}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 font-medium">
            Subject: {subject}
          </span>
          {!student && (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              Verify ID for Rewards
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Control Panel & Chat Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-4 space-y-5 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Study Settings</span>
            </h3>
            <span className="text-[11px] text-slate-400">Customized Engine</span>
          </div>

          {/* Grade Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Grade / Standard</label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
            >
              {GRADES.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#0a0c1b] text-white">{g.label}</option>
              ))}
            </select>
          </div>

          {/* Board Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Educational Board</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
            >
              {BOARDS.map((b) => (
                <option key={b.value} value={b.value} className="bg-[#0a0c1b] text-white">{b.label}</option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#0a0c1b] text-white">{l.label}</option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSubject(s.value)}
                  className={`p-2 rounded-xl text-left text-xs font-medium border transition-all ${
                    subject === s.value
                      ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200 font-bold shadow-md shadow-indigo-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {s.value}
                </button>
              ))}
            </div>
          </div>

          {/* Answer Type Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Response Depth & Format</label>
            <div className="space-y-2">
              {[
                { id: 'short', title: 'Short Answer', desc: 'Quick 2-3 sentence core answer' },
                { id: 'detailed', title: 'Detailed Explanation', desc: 'In-depth with examples & formulas' },
                { id: 'step_by_step', title: 'Step-by-Step Breakdown', desc: 'Numerical / logical solution steps' },
                { id: 'exam_notes', title: 'Exam Revision Notes', desc: 'Bullet points, key terms & expected questions' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAnswerType(f.id as AnswerType)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs border transition-all ${
                    answerType === f.id
                      ? 'bg-indigo-500 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-500/30'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-[10px] opacity-80 font-normal">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Prompting & Response Stage */}
        <div className="lg:col-span-8 space-y-5 flex flex-col justify-between">
          
          {/* Top Suggested Quick Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Suggested Topper Prompts (Grade {grade}):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(p.text);
                    setSubject(p.subject);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-slate-200 text-xs font-medium transition-all hover:border-indigo-400/50 hover:text-white"
                >
                  {p.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Output Display Card */}
          <div className="min-h-[320px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative shadow-2xl">
            
            {loading ? (
              <div className="my-auto py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-400 animate-spin">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Gemini AI Brain is Analyzing...</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Generating Grade {grade} ({board}) explanation in {language}...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="my-auto py-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center space-y-2">
                <p className="font-bold">Execution Error</p>
                <p>{error}</p>
                <button
                  onClick={() => handleSubmitPrompt()}
                  className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-500 transition-colors shadow-lg"
                >
                  Retry Prompt
                </button>
              </div>
            ) : response ? (
              <div className="space-y-4">
                {/* Response Action Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400">
                      Grade {grade} AI Solution Ready
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleAudioTTS}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        isPlayingAudio
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                      }`}
                      title="Listen via Audio TTS"
                    >
                      {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Voice' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleSaveNoteClick}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        saved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span className="hidden sm:inline">{saved ? 'Saved' : 'Save Note'}</span>
                    </button>
                  </div>
                </div>

                {/* Markdown / Text Response Body */}
                <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-indigo-500 selection:text-white max-h-[420px] overflow-y-auto pr-2">
                  {response}
                </div>
              </div>
            ) : (
              <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ready for your question!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Ask a homework problem, snap an equation, or select a suggested topic to generate step-by-step solutions in {language}.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Prompt Input Control */}
          <form onSubmit={handleSubmitPrompt} className="space-y-3">
            
            {/* Image Preview Box */}
            {imagePreview && (
              <div className="p-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl flex items-center justify-between w-fit gap-3">
                <div className="flex items-center gap-2">
                  <img src={imagePreview} alt="Homework Attachment" className="w-10 h-10 object-cover rounded-lg border border-white/20" />
                  <span className="text-xs text-slate-200 font-medium">Textbook / Homework Image Attached</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-400 transition-all">
              
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Upload Textbook or Homework Image"
              >
                <ImageIcon className="w-5 h-5 text-indigo-400" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Text Input */}
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitPrompt();
                  }
                }}
                placeholder={`Ask any Grade ${grade} (${board}) topic in ${language}... (e.g., 'Solve 2x + 5 = 15', 'Explain Newton's Laws')`}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none resize-none"
              />

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-bounce'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Voice Recording Input"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-400" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!question.trim() && !imageBase64)}
                className="ml-2 p-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded border border-white/15 text-slate-300">Enter</kbd> to submit</span>
              <span>Powered by Gemini 3.6 Flash Server Engine</span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
