export type AnswerType = 'short' | 'long' | 'step_by_step' | 'exam_notes';

export interface StudentProfile {
  id: string;
  name: string;
  phone: string;
  grade: number; // 1 to 12 or 13 for College/University
  board: string; // GSEB, CBSE, ICSE, IB, Cambridge, State Board, US K-12, SAT, University
  school: string;
  language: string; // Gujarati, Hindi, English, Spanish, French, Marathi, etc.
  isVerified?: boolean;
  avatarUrl?: string;
}

export interface StudentQuery {
  student_id: string;
  grade: number;
  board: string;
  question: string;
  answer_type: AnswerType;
  language: string;
  subject: string;
  imageBase64?: string;
}

export interface AIResponseData {
  success: boolean;
  response: string;
  grade: number;
  board: string;
  subject: string;
  answer_type: AnswerType;
  language: string;
  timestamp: string;
}

export interface OCRVerificationResult {
  extracted_id?: string;
  extracted_name?: string;
  extracted_grade?: string | number;
  extracted_board?: string;
  school_name?: string;
  is_valid_student_id?: boolean;
  confidence_score?: number;
  summary?: string;
}

export interface SavedNote {
  id: string;
  question: string;
  answer: string;
  subject: string;
  grade: number;
  board: string;
  answerType: AnswerType;
  language: string;
  timestamp: string;
}

export type ActiveTab = 'ai-assistant' | 'ocr-scanner' | 'translator' | 'blueprint' | 'security';
