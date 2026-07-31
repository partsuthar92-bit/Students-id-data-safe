import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Volume2, Sparkles, VolumeX } from 'lucide-react';
import { LANGUAGES } from '../data/sampleData';

export const TranslatorView: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Gujarati');
  const [sourceText, setSourceText] = useState('Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText || sourceText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sourceText.trim()) return;

    setLoading(true);
    setTranslatedText('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          source_language: sourceLang,
          target_language: targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed');

      setTranslatedText(data.translated_text);
    } catch (err: any) {
      alert(err.message || 'Failed to translate.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    if (targetLang === 'Gujarati') utterance.lang = 'gu-IN';
    else if (targetLang === 'Hindi') utterance.lang = 'hi-IN';
    else if (targetLang === 'Spanish') utterance.lang = 'es-ES';
    else if (targetLang === 'French') utterance.lang = 'fr-FR';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Universal Educational Multi-Language Translator</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Accurate academic translation preserving scientific terms, formulas, and educational context.
            </p>
          </div>
        </div>
      </div>

      {/* Language Selectors & Swap */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Source Language */}
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Source Language</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} className="bg-[#0a0c1b] text-white">{l.label}</option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwapLanguages}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-colors shrink-0 backdrop-blur-md"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Target Language */}
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-[#0a0c1b]/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} className="bg-[#0a0c1b] text-white">{l.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Translation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Input */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white">{sourceLang} Input Text</span>
            <span className="text-[10px] text-slate-400">{sourceText.length} characters</span>
          </div>

          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste educational text to translate..."
            className="w-full bg-white/5 border border-white/15 backdrop-blur-md rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 resize-none leading-relaxed"
          />

          <button
            onClick={() => handleTranslate()}
            disabled={loading || !sourceText.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-pulse">Translating Educational Terms...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Translate to {targetLang}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-emerald-400">{targetLang} Translation</span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSpeak}
                disabled={!translatedText}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs flex items-center gap-1"
                title="Pronounce Translation"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={handleCopy}
                disabled={!translatedText}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs flex items-center gap-1"
                title="Copy Translation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="min-h-[190px] bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {loading ? (
              <p className="text-slate-400 italic">Translating into {targetLang} with Gemini 3.6 Flash...</p>
            ) : translatedText ? (
              translatedText
            ) : (
              <p className="text-slate-400 italic">Translated output will appear here...</p>
            )}
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
            💡 Educational terminology, scientific definitions, and mathematical notation are strictly contextualized.
          </div>
        </div>

      </div>
    </div>
  );
};
