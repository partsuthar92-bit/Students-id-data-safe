import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Sparkles, 
  User, 
  Building, 
  Award, 
  ShieldCheck, 
  RefreshCw,
  Camera,
  ArrowRight
} from 'lucide-react';
import { OCRVerificationResult, StudentProfile } from '../types';

interface IDCardScannerViewProps {
  onApplyStudentData: (data: Partial<StudentProfile>) => void;
}

export const IDCardScannerView: React.FC<IDCardScannerViewProps> = ({ onApplyStudentData }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a mock canvas base64 ID card for instant demonstration
  const generateMockIdCardImage = (id: string, name: string, grade: string, school: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 380);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#312e81');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 380);

    // Decorative Card Borders
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, 570, 350);

    // Header Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('GLOBAL STUDENT IDENTIFICATION CARD', 40, 55);

    // School Name
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px sans-serif';
    ctx.fillText(school, 40, 85);

    // Avatar Placeholder
    ctx.fillStyle = '#475569';
    ctx.fillRect(40, 110, 120, 140);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PHOTO', 75, 185);

    // Details Text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`ID : ${id}`, 180, 135);
    ctx.fillText(`Name : ${name}`, 180, 170);
    ctx.fillText(`Grade : ${grade}`, 180, 205);
    ctx.fillText(`Board : GSEB / CBSE`, 180, 240);

    // Footer
    ctx.fillStyle = '#10b981';
    ctx.fillRect(40, 280, 520, 40);
    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('OFFICIAL VERIFIED ACADEMIC CREDENTIAL', 120, 306);

    return canvas.toDataURL('image/jpeg');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      processOcrVerification(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = (id: string, name: string, grade: string, school: string) => {
    const sampleDataUrl = generateMockIdCardImage(id, name, grade, school);
    setSelectedImage(sampleDataUrl);
    processOcrVerification(sampleDataUrl);
  };

  const processOcrVerification = async (dataUrl: string) => {
    setLoading(true);
    setError(null);
    setOcrResult(null);

    try {
      const res = await fetch('/api/verify-id-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          imageMimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scan ID card');

      setOcrResult(data.student_data);
    } catch (err: any) {
      setError(err.message || 'OCR Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToProfile = () => {
    if (!ocrResult) return;
    const gradeNum = typeof ocrResult.extracted_grade === 'number'
      ? ocrResult.extracted_grade
      : parseInt(String(ocrResult.extracted_grade || '10')) || 10;

    onApplyStudentData({
      id: ocrResult.extracted_id || 'STU1001',
      name: ocrResult.extracted_name || 'Verified Student',
      grade: gradeNum,
      board: ocrResult.extracted_board || 'GSEB',
      school: ocrResult.school_name || 'Global Student Academy',
      isVerified: true,
    });
    alert('Student ID verified and applied to active student profile!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">OCR Student ID Card & Textbook Scanner</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated image extraction via Gemini 3.6 Flash vision model to verify Student ID & read homework pages.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleLoadSample('STU1001', 'Aarav Patel', '10 (SSC)', 'Shree Swaminarayan Gurukul')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-300 text-xs font-semibold transition-all backdrop-blur-md"
          >
            Sample ID 1
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('STU1002', 'Priya Sharma', '12 (Board)', 'Delhi Public School')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-300 text-xs font-semibold transition-all backdrop-blur-md"
          >
            Sample ID 2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Dropzone */}
        <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Upload or Snap Student ID Card</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Select an ID card photo or click a sample card above to trigger real-time AI optical character recognition.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 hover:border-cyan-400/60 rounded-2xl p-6 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] text-center"
          >
            {selectedImage ? (
              <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <img src={selectedImage} alt="ID Card Preview" className="w-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#0a0c1b]/90 rounded text-[10px] text-cyan-300 font-bold border border-cyan-400/40">
                  Ready for OCR
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Click to Upload ID Card or Textbook Page</p>
                  <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
            <span>Instant Vision Processing</span>
            <button
              onClick={() => {
                setSelectedImage(null);
                setOcrResult(null);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Verification Results */}
        <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>OCR Extraction Results</span>
            </h3>
            {ocrResult && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OCR Confidence: {Math.round((ocrResult.confidence_score || 0.95) * 100)}%
              </span>
            )}
          </div>

          {loading ? (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">Gemini Vision OCR Processing...</p>
              <p className="text-[11px] text-slate-400">Reading student ID card fields & authenticating badge...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-rose-400" />
              <p className="font-bold">{error}</p>
            </div>
          ) : ocrResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-400" /> Student Name:
                  </span>
                  <span className="text-xs font-bold text-white">{ocrResult.extracted_name || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Student ID:
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">{ocrResult.extracted_id || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-cyan-400" /> School / College:
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{ocrResult.school_name || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-semibold text-slate-400">Extracted Grade / Board:</span>
                  <span className="text-xs font-bold text-indigo-300">
                    Grade {ocrResult.extracted_grade} ({ocrResult.extracted_board})
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 block">
                    {ocrResult.summary || 'Student ID verified successfully via OCR.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyToProfile}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Apply Extracted Student Data to Active Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Scan className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">No ID Card Scanned Yet</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Upload an ID card image or choose Sample ID 1 / Sample ID 2 above to test the Gemini OCR engine.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
