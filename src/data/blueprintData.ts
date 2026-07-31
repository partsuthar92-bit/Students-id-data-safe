export const FASTAPI_CODE = `from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
import pytesseract
import io
import re

app = FastAPI(title="Global Student AI Assistance Engine")

# Gemini AI Setup
genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel('gemini-1.5-pro')

# Request Models
class StudentQuery(BaseModel):
    student_id: str
    grade: int
    board: str
    question: str
    answer_type: str  # 'short', 'long', 'step_by_step', 'exam_notes'
    language: str     # 'Gujarati', 'Hindi', 'English', etc.

class TranslationRequest(BaseModel):
    text: str
    target_language: str

@app.get("/")
def home():
    return {"message": "Welcome to Global Student AI Assistance Platform API"}

# 1. OCR Based Student ID Card Verification
def extract_id_card_details(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    extracted_text = pytesseract.image_to_string(image)
    
    student_id_match = re.search(r'ID\\s*:\\s*([A-Z0-9]+)', extracted_text)
    grade_match = re.search(r'(Grade|Standard|Class)\\s*:\\s*(\\d+)', extracted_text, re.IGNORECASE)
    
    return {
        "extracted_id": student_id_match.group(1) if student_id_match else None,
        "extracted_grade": grade_match.group(2) if grade_match else None
    }

@app.post("/verify-id-card/")
async def verify_student_card(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="ફક્ત ઈમેજ ફાઈલ (JPG/PNG) અપલોડ કરો.")
    
    image_bytes = await file.read()
    data = extract_id_card_details(image_bytes)
    
    if not data["extracted_id"]:
        return {"status": "Failed", "message": "ID કાર્ડ સ્પષ્ટ નથી."}
        
    return {"status": "Success", "verified": True, "student_data": data}

# 2. Smart AI Learning Assistant (Gemini Integration)
@app.post("/ask-ai")
def ask_ai(query: StudentQuery):
    system_prompt = f"""
    You are a world-class AI tutor for a Grade {query.grade} student (Board: {query.board}).
    Answer the question specifically tailored to Grade {query.grade} level.
    Language: {query.language}.
    Format required: {query.answer_type}.
    Rule: Keep it strictly educational. Help the student become a topper. Avoid any non-educational content.
    Question: {query.question}
    """
    response = model.generate_content(system_prompt)
    return {"response": response.text}

# 3. Universal Multi-language Translator
@app.post("/translate")
def translate_text(req: TranslationRequest):
    prompt = f"Translate the following text to {req.target_language} accurately for education purposes: {req.text}"
    response = model.generate_content(prompt)
    return {"translated_text": response.text}`;

export const FIREBASE_CODE = `const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.requestOtpForStudent = functions.https.onCall(async (data, context) => {
  const studentId = data.studentId;
  if (!studentId) {
    throw new functions.https.HttpsError('invalid-argument', 'Student ID આપવી ફરજિયાત છે.');
  }

  const studentDoc = await admin.firestore().collection('students').doc(studentId).get();
  if (!studentDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'આ Student ID નોંધાયેલી નથી.');
  }

  const studentData = studentDoc.data();
  if (!studentData.is_active) {
    throw new functions.https.HttpsError('permission-denied', 'આ એકાઉન્ટ નિષ્ક્રિય છે.');
  }

  return {
    success: true,
    phoneNumber: studentData.phone_number,
    message: "Student ID માન્ય છે. OTP મોકલવામાં આવી રહ્યો છે."
  };
});`;

export const FLUTTER_CODE = `import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_functions/cloud_functions.dart';

void main() {
  runApp(const StudentAIApp());
}

class StudentAIApp extends StatelessWidget {
  const StudentAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Global Student AI Companion',
      theme: ThemeData(primarySwatch: Colors.deepPurple, useMaterial3: true),
      home: const StudentOtpLoginScreen(),
    );
  }
}

class StudentOtpLoginScreen extends StatefulWidget {
  const StudentOtpLoginScreen({super.key});

  @override
  State<StudentOtpLoginScreen> createState() => _StudentOtpLoginScreenState();
}

class _StudentOtpLoginScreenState extends State<StudentOtpLoginScreen> {
  final TextEditingController _studentIdController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  String? _verificationId;
  bool _isOtpSent = false;
  bool _isLoading = false;

  Future<void> _verifyStudentAndSendOtp() async {
    setState(() => _isLoading = true);
    try {
      final HttpsCallable callable = _functions.httpsCallable('requestOtpForStudent');
      final response = await callable.call({'studentId': _studentIdController.text.trim()});

      if (response.data['success'] == true) {
        String phoneNumber = response.data['phoneNumber'];
        await _auth.verifyPhoneNumber(
          phoneNumber: phoneNumber,
          verificationCompleted: (PhoneAuthCredential credential) async {
            await _auth.signInWithCredential(credential);
            _navigateToChat();
          },
          verificationFailed: (FirebaseAuthException e) {
            _showSnackBar("OTP ભૂલ: \${e.message}");
          },
          codeSent: (String verificationId, int? resendToken) {
            setState(() {
              _verificationId = verificationId;
              _isOtpSent = true;
            });
            _showSnackBar("OTP સફળતાપૂર્વક મોકલવામાં આવ્યો છે.");
          },
          codeAutoRetrievalTimeout: (String verificationId) {
            _verificationId = verificationId;
          },
        );
      }
    } catch (e) {
      _showSnackBar("ભૂલ: \${e.toString()}");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOtp() async {
    if (_verificationId == null || _otpController.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      PhoneAuthCredential credential = PhoneAuthProvider.credential(
        verificationId: _verificationId!,
        smsCode: _otpController.text.trim(),
      );
      await _auth.signInWithCredential(credential);
      _navigateToChat();
    } catch (e) {
      _showSnackBar("અમાન્ય OTP! ફરીથી પ્રયાસ કરો.");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _navigateToChat() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const ChatScreen()),
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Student Secure Login")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (!_isOtpSent) ...[
              TextField(
                controller: _studentIdController,
                decoration: const InputDecoration(
                  labelText: "Student ID દાખલ કરો (દા.ત. STU1001)",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.badge),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyStudentAndSendOtp,
                  child: _isLoading ? const CircularProgressIndicator() : const Text("OTP મેળવો"),
                ),
              ),
            ] else ...[
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: "6-અંકનો OTP દાખલ કરો",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyOtp,
                  child: const Text("વેરીફાય અને લોગિન"),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [
    {"sender": "ai", "text": "નમસ્તે વિદ્યાર્થી મિત્ર! આજે કયો વિષય ભણવો છે?"}
  ];

  void _sendMessage() {
    if (_controller.text.trim().isEmpty) return;
    setState(() {
      _messages.add({"sender": "user", "text": _controller.text});
      _messages.add({"sender": "ai", "text": "તમારા ધોરણ મુજબ જવાબ તૈયાર થઈ રહ્યો છે..."});
    });
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AI Study Assistant")),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final isUser = _messages[index]["sender"] == "user";
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.deepPurple : Colors.grey[200],
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      _messages[index]["text"]!,
                      style: TextStyle(color: isUser ? Colors.white : Colors.black87),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "પ્રશ્ન પૂછો...",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                  ),
                ),
                IconButton(icon: const Icon(Icons.send), onPressed: _sendMessage),
              ],
            ),
          )
        ],
      ),
    );
  }
}`;

export const TECH_STACK_SUMMARY = [
  { name: "Frontend App UI", tech: "Flutter (Android & iOS)", desc: "Single cross-platform code base with native performance & Material 3 styling." },
  { name: "Backend API Engine", tech: "Python FastAPI", desc: "High-performance asynchronous REST API handling Gemini AI & OCR processing." },
  { name: "AI Brain", tech: "Gemini 3.6 Flash / Pro API", desc: "Customized system prompts tailored to student Grade, Board & Language." },
  { name: "Database & Authentication", tech: "Firebase Firestore & Auth (OTP) + PostgreSQL", desc: "Secure Student ID verification & phone number SMS authentication." },
  { name: "Audio & Translation Engine", tech: "Gemini Speech & Whisper AI", desc: "Multi-language educational translation & text-to-speech audio companion." },
  { name: "Security & DDoS Protection", tech: "Cloudflare, Rate Limiter & JWT", desc: "Anti-hack guardrails, strict COPPA/FERPA educational filter & rate limiting." }
];

export const STORE_COMPLIANCE = {
  playStore: [
    "One-time $25 Developer Account Registration.",
    "Strict compliance with Google Families Policy & COPPA/FERPA student data privacy laws.",
    "Explicit Privacy Policy detailing student phone number & ID handling.",
    "Age rating questionnaire completed for educational content (< 18 target audience)."
  ],
  appStore: [
    "$99/year Apple Developer Program subscription.",
    "Strict review of Student ID authentication & data collection transparency.",
    "Mandatory HTTPS / TLS security and OAuth / OTP security compliance.",
    "In-App Support and Privacy Policy link prominently hosted."
  ]
};
