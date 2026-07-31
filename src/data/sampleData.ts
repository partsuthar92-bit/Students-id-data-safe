export const GRADES = [
  { value: 1, label: "Grade 1 (ધોરણ ૧)" },
  { value: 2, label: "Grade 2 (ધોરણ ૨)" },
  { value: 3, label: "Grade 3 (ધોરણ ૩)" },
  { value: 4, label: "Grade 4 (ધોરણ ૪)" },
  { value: 5, label: "Grade 5 (ધોરણ ૫)" },
  { value: 6, label: "Grade 6 (ધોરણ ૬)" },
  { value: 7, label: "Grade 7 (ધોરણ ૭)" },
  { value: 8, label: "Grade 8 (ધોરણ ૮)" },
  { value: 9, label: "Grade 9 (ધોરણ ૯)" },
  { value: 10, label: "Grade 10 (SSC / 10મું)" },
  { value: 11, label: "Grade 11 (HSC / 11મું)" },
  { value: 12, label: "Grade 12 (Board / 12મું)" },
  { value: 13, label: "University / Higher Ed (કોલેજ)" }
];

export const BOARDS = [
  { value: "GSEB", label: "GSEB (Gujarat Secondary & Higher Sec Board)" },
  { value: "CBSE", label: "CBSE (Central Board of Secondary Education)" },
  { value: "ICSE", label: "ICSE / CISCE" },
  { value: "IB", label: "IB (International Baccalaureate)" },
  { value: "State Board", label: "State Board (Maharashtra, Rajasthan, etc.)" },
  { value: "US K-12", label: "US K-12 / Common Core" },
  { value: "SAT/ACT", label: "SAT / ACT Exam Prep" },
  { value: "University", label: "Higher Education / University" }
];

export const LANGUAGES = [
  { value: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "Hindi", label: "હિન્દી (Hindi)" },
  { value: "English", label: "English" },
  { value: "Marathi", label: "મરાઠી (Marathi)" },
  { value: "Spanish", label: "Español (Spanish)" },
  { value: "French", label: "Français (French)" },
  { value: "German", label: "Deutsch (German)" },
  { value: "Tamil", label: "தமிழ் (Tamil)" },
  { value: "Bengali", label: "বাংলা (Bengali)" }
];

export const SUBJECTS = [
  { value: "Mathematics", label: "Mathematics / ગણિત", icon: "Calculator" },
  { value: "Science", label: "General Science / વિજ્ઞાન", icon: "Atom" },
  { value: "Physics", label: "Physics / ભૌતિક વિજ્ઞાન", icon: "Zap" },
  { value: "Chemistry", label: "Chemistry / રસાયણ વિજ્ઞાન", icon: "FlaskConical" },
  { value: "Biology", label: "Biology / જીવ વિજ્ઞાન", icon: "Dna" },
  { value: "Social Studies", label: "Social Science & History / સામાજિક વિજ્ઞાન", icon: "Globe" },
  { value: "English Literature", label: "English & Grammar / અંગ્રેજી", icon: "BookOpen" },
  { value: "Computer Science", label: "Computer & AI / કમ્પ્યુટર", icon: "Cpu" },
  { value: "General Knowledge", label: "General Knowledge & Logic", icon: "Brain" }
];

export const SUGGESTED_PROMPTS = [
  {
    grade: 10,
    subject: "Science",
    text: "પ્રકાશનું પરાવર્તન અને વક્રીભવન (Reflection & Refraction of Light) ઉદાહરણ સાથે સમજાવો.",
    shortLabel: "પ્રકાશનું પરાવર્તન"
  },
  {
    grade: 10,
    subject: "Mathematics",
    text: "પાયથાગોરસ પ્રમેય (Pythagoras Theorem) સ્ટેપ-બાય-સ્ટેપ ઉદાહરણ સાથે સાબિત કરો.",
    shortLabel: "Pythagoras Theorem"
  },
  {
    grade: 12,
    subject: "Chemistry",
    text: "Explain Le Chatelier's Principle in chemical equilibrium with reaction rate examples.",
    shortLabel: "Chemical Equilibrium"
  },
  {
    grade: 10,
    subject: "Social Studies",
    text: "ભારતના સ્વતંત્રતા સંગ્રામમાં મહાત્મા ગાંધીજીનું યોગદાન મુખ્ય મુદ્દાઓમાં આપો.",
    shortLabel: "સ્વતંત્રતા સંગ્રામ"
  },
  {
    grade: 9,
    subject: "Physics",
    text: "Newton's 3 Laws of Motion explained with real-world automobile examples.",
    shortLabel: "Newton's Laws"
  }
];

// Helper base64 generator for sample ID Cards and textbook problems
export const SAMPLE_ID_CARD_DATA = {
  id: "STU1001",
  name: "Aarav Patel",
  grade: "10 (SSC)",
  board: "GSEB",
  school: "Shree Swaminarayan Gurukul School",
  phone: "+91 98765 43210"
};
