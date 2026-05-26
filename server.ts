import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { 
  User, 
  NewsItem, 
  School, 
  ExamResult, 
  DocumentItem, 
  ContactInquiry, 
  SystemStats 
} from "./src/types";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Define a simple, robust secret for JWT/HMAC token generation
const JWT_SECRET = "TIGRAY_EDU_SECRET_2026_AUTHORITY_KEY";

// Helper to encrypt passwords using pbkdf2
function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, "tigray_salt", 1000, 64, "sha512").toString("hex");
}

// Custom JWT implementation using native Node crypto to ensure zero runtime package errors
function generateToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${claims}`).digest("base64url");
  return `${header}.${claims}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const [header, claims, signature] = token.split(".");
    if (!header || !claims || !signature) return null;
    const computedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${claims}`).digest("base64url");
    if (computedSig !== signature) return null;
    const parsedClaims = JSON.parse(Buffer.from(claims, "base64url").toString("utf-8"));
    if (parsedClaims.exp < Date.now()) return null; // Expired
    return parsedClaims;
  } catch {
    return null;
  }
}

// Initial Database seeds
const initialUsers: User[] = [
  {
    id: "usr-1",
    name: "Dr. Kiros Hagos",
    email: "admin@tigrayedu.gov.et",
    role: "Super Admin",
    passwordHash: hashPassword("admin123")
  },
  {
    id: "usr-2",
    name: "Mulugeta Assefa",
    email: "officer@tigrayedu.gov.et",
    role: "Regional Officer",
    passwordHash: hashPassword("officer123")
  }
];

const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Regional Grade 12 National Exam Preparedness Guidelines Released",
    titleTg: "መትከሊታት ምድላው ሃገራዊ ፈተና ክፍሊ 12 ክልላዊ መምርሒ ተሓቲሙ",
    body: "The Tigray Regional Education Office has finalized preparations and safety directives for the upcoming university entrance exams. Additional training bootcamps are being scheduled for schools across Mekelle, Adwa, and Shire to guarantee students are equipped for Success. Psychological support modules are integrated.",
    bodyTg: "ቢሮ ትምህርቲ ክልል ትግራይ ንዝቕፅል ናይ ዩኒቨርሲቲ መእተዊ ፈተና ምድላዋትን ድሕንነት መምርሒታትን ወዲኡ ኣሎ። ተምሃሮ ንዓወት ክበቕዑ ኣብ መቐለ፣ ዓድዋን ሽረን ዝርከቡ ኣብያተ ትምህርቲ ተወሰኽቲ ናይ ስልጠና መርሃ-ግብርታት ተታሒዞም ኣለና።",
    category: "Exams",
    publishedAt: "2026-05-24T10:00:00Z",
    authorId: "usr-1",
    authorName: "Dr. Kiros Hagos"
  },
  {
    id: "news-2",
    title: "Launch of Digital Learning Labs in 25 Secondary Schools across Tigray",
    titleTg: "ኣብ 25 ካልኣይ ብርኪ ኣብያተ ትምህርቲ ዲጂታል ላቦራቶሪታት ተሃኒፆም",
    body: "In collaboration with global educational charities, academic institutions are receiving high-throughput solar-powered computer labs. This marks a significant milestone in our commitment to digitize high school environments, ensuring technological access reaches both urban and remote districts.",
    bodyTg: "ምስ ዓለምለኻውያን ትካላት ትምህርቲ ብምትሕብባር፣ ኣብያተ ትምህርቲ ብፀሓይ ሓይሊ ዝሰርሑ ኮምፒውተር ቤተ-ሙከራታት ይቕበሉ ኣለዉ። እዙይ ንፈለማ እዋን ኣብ ካልኣይ ብርኪ ኣብያተ ትምህርቲ ዲጂታል ተበፃሕነት ንምምላእ ዓብዪ ስጉምቲ እዩ።",
    category: "Policy",
    publishedAt: "2026-05-20T14:30:00Z",
    authorId: "usr-2",
    authorName: "Mulugeta Assefa"
  },
  {
    id: "news-3",
    title: "Primary Teacher Pedagogy & Trauma-Informed Seminars Organized",
    titleTg: "መምህራን መባእታ ስነ-ኣእምሮኣዊ ድጋፍ መድርኽ ስልጠና ተሳሊጡ",
    body: "Over 800 primary teachers have successfully completed the regional recovery pedagogy training. Overcoming conflict-stress and fostering inclusive learning models remained the focal highlights of this seven-day intensive forum compiled in regional centers.",
    bodyTg: "ልዕሊ 800 መምህራን መባእታ ናይ ምሕውያት ኣስተምህሮ ስልጠና ወዲኦም ኣለዉ። ፀቕጢ ምስጋርን ኩለመደናዊ ክፍሊ ምምራሕን እዞም ሾብዓተ መዓልታት ዝወሰደ መድረኽ ሓፈሻዊ ትኹረታት እዮም ነይሮም።",
    category: "Events",
    publishedAt: "2026-05-15T09:15:00Z",
    authorId: "usr-1",
    authorName: "Dr. Kiros Hagos"
  },
  {
    id: "news-4",
    title: "Stipend and Scholarship Programs Announced for Outstanding Female Students",
    titleTg: "ንፉዓት ደቂ ኣንስትዮ ተምሃሮ ናይ ስኮላርሺፕን ደገፍ ክፍሊትን ተገሊፁ",
    body: "Applications are now open for the Regional STEM Female Scholar Initiative. This package offsets living costs, tuition, and supplies for outstanding students focusing on Engineering, Medical Sciences, and Software Development in public universities.",
    bodyTg: "ናይ ክልላዊ STEM ደቂ ኣንስትዮ ተምሃሮ ምውህሃድ ትምህርቲ ድጋፍ ሕዚ ክፍቲ እዩ። እዙይ ደገፍ እዙይ ዋጋ መንበሪ፣ ትምህርትን ናውትን ብምሽፋን ንፉዓት ተምሃሮ ኢንጂነሪንግን ሕክምናን ክመሃራ ይሕግዝ።",
    category: "Scholarships",
    publishedAt: "2026-05-10T08:00:00Z",
    authorId: "usr-2",
    authorName: "Mulugeta Assefa"
  }
];

const initialSchools: School[] = [
  {
    id: "sch-1",
    name: "Kallamino Special High School",
    nameTg: "ፍሉይ ካልኣይ ብርኪ ቤት ትምህርቲ ቃላሚኖ",
    type: "Public",
    zone: "Mekelle",
    zoneTg: "መቐለ",
    woreda: "Mekelle",
    woredaTg: "መቐለ",
    level: "Secondary",
    studentCount: 780
  },
  {
    id: "sch-2",
    name: "Atse Yohannes Secondary School",
    nameTg: "ቤት ትምህርቲ ሃፀይ ዮሃንስ",
    type: "Public",
    zone: "Mekelle",
    zoneTg: "መቐለ",
    woreda: "Mekelle",
    woredaTg: "መቐለ",
    level: "Secondary",
    studentCount: 1420
  },
  {
    id: "sch-3",
    name: "Adwa Primary & Secondary Recovery School",
    nameTg: "ቤት ትምህርቲ ምሕውያት ዓድዋ",
    type: "Public",
    zone: "Central",
    zoneTg: "ማእኸላይ",
    woreda: "Adwa",
    woredaTg: "ዓድዋ",
    level: "Secondary",
    studentCount: 950
  },
  {
    id: "sch-4",
    name: "Axum Comprehensive TVET Institute",
    nameTg: "ቤት ትምህርቲ ቴክኒክን ሞያን ኣኽሱም",
    type: "Public",
    zone: "Central",
    zoneTg: "ማእኸላይ",
    woreda: "Axum",
    woredaTg: "ኣኽሱም",
    level: "TVET",
    studentCount: 610
  },
  {
    id: "sch-5",
    name: "Wukro St. Mary Preparatory",
    nameTg: "ቅድስት ማርያም ድጋፍ ውቕሮ",
    type: "Private",
    zone: "Eastern",
    zoneTg: "ምብራቕ",
    woreda: "Wukro",
    woredaTg: "ውቕሮ",
    level: "Secondary",
    studentCount: 450
  },
  {
    id: "sch-6",
    name: "Maychew Primary School",
    nameTg: "መባእታ ቤት ትምህርቲ ማይጨው",
    type: "Public",
    zone: "Southern",
    zoneTg: "ደቡብ",
    woreda: "Maychew",
    woredaTg: "ማይጨው",
    level: "Primary",
    studentCount: 1120
  },
  {
    id: "sch-7",
    name: "Shire High School",
    nameTg: "ቤት ትምህርቲ ካልኣይ ብርኪ ሽረ",
    type: "Public",
    zone: "Northwestern",
    zoneTg: "ሰሜን ምዕራብ",
    woreda: "Shire Indaselassie",
    woredaTg: "ሽረ እንዳስላሴ",
    level: "Secondary",
    studentCount: 1250
  },
  {
    id: "sch-8",
    name: "Humera TVET Center",
    nameTg: "ማእኸል ሞያ ሑመራ",
    type: "Public",
    zone: "Western",
    zoneTg: "ምዕራብ",
    woreda: "Humera",
    woredaTg: "ሑመራ",
    level: "TVET",
    studentCount: 380
  }
];

const initialExamResults: ExamResult[] = [
  {
    id: "res-1",
    studentId: "TRE-40918",
    studentName: "Filmon Tesfay",
    studentNameTg: "ፊልሞን ተስፋይ",
    year: 2016, // Ethiopian Calendar (roughly 2024 GC)
    gradeLevel: 12,
    schoolName: "Kallamino Special High School",
    schoolNameTg: "ፍሉይ ካልኣይ ብርኪ ቤት ትምህርቲ ቃላሚኖ",
    subjectScores: {
      "English": 92,
      "Mathematics": 98,
      "Physics": 96,
      "Chemistry": 94,
      "Biology": 90,
      "Civics": 88,
      "Scholastic Aptitude": 95
    },
    total: 653,
    maxPossible: 700,
    passed: true
  },
  {
    id: "res-2",
    studentId: "TRE-40919",
    studentName: "Saba Gidey",
    studentNameTg: "ሳባ ጊደይ",
    year: 2016,
    gradeLevel: 12,
    schoolName: "Atse Yohannes Secondary School",
    schoolNameTg: "ቤት ትምህርቲ ሃፀይ ዮሃንስ",
    subjectScores: {
      "English": 85,
      "Mathematics": 88,
      "Physics": 82,
      "Chemistry": 84,
      "Biology": 89,
      "Civics": 80,
      "Scholastic Aptitude": 86
    },
    total: 574,
    maxPossible: 700,
    passed: true
  },
  {
    id: "res-3",
    studentId: "TRE-80321",
    studentName: "Amanuel Hailu",
    studentNameTg: "ኣማኑኤል ሃይሉ",
    year: 2016,
    gradeLevel: 8,
    schoolName: "Maychew Primary School",
    schoolNameTg: "መባእታ ቤት ትምህርቲ ማይጨው",
    subjectScores: {
      "Tigrinya": 90,
      "English": 82,
      "Mathematics": 88,
      "Science": 85,
      "Social Studies": 80
    },
    total: 425,
    maxPossible: 500,
    passed: true
  },
  {
    id: "res-4",
    studentId: "TRE-80322",
    studentName: "Semhal Berhe",
    studentNameTg: "ሰምሃል በርሀ",
    year: 2016,
    gradeLevel: 8,
    schoolName: "Maychew Primary School",
    schoolNameTg: "መባእታ ቤት ትምህርቲ ማይጨው",
    subjectScores: {
      "Tigrinya": 94,
      "English": 88,
      "Mathematics": 91,
      "Science": 89,
      "Social Studies": 92
    },
    total: 454,
    maxPossible: 500,
    passed: true
  },
  {
    id: "res-5",
    studentId: "TRE-10201",
    studentName: "Solomon Kahsay",
    studentNameTg: "ሰሎሞን ካሕሳይ",
    year: 2016,
    gradeLevel: 10,
    schoolName: "Adwa Primary & Secondary Recovery School",
    schoolNameTg: "ቤት ትምህርቲ ምሕውያት ዓድዋ",
    subjectScores: {
      "English": 74,
      "Mathematics": 78,
      "Physics": 71,
      "Chemistry": 68,
      "Biology": 75,
      "Civics": 80,
      "Geography": 82
    },
    total: 528,
    maxPossible: 700,
    passed: true
  }
];

const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Regional Academic Calendar for Post-War School Rehabilitation Year 2016-2017",
    titleTg: "ክልላዊ ዓመታዊ መርሃ-ግብር ዓመተ ትምህርቲ 2016-2017",
    category: "Policy Document",
    categoryTg: "ሰነድ ፖሊሲ",
    fileSize: "1.4 MB",
    uploadedAt: "2026-05-18T11:00:00Z",
    fileUrl: "#calendar"
  },
  {
    id: "doc-2",
    title: "Grade 8 Regional Standard Mathematics Teaching & Assessment Manual",
    titleTg: "መባእታ መምርሒ ኣስተምህሮን ምዘናን ሒሳብ 8ይ ክፍሊ",
    category: "Curriculum Guide",
    categoryTg: "መምርሒ ሰነድ ስርዓተ ትምህርቲ",
    fileSize: "3.2 MB",
    uploadedAt: "2026-05-12T14:00:00Z",
    fileUrl: "#curriculum"
  },
  {
    id: "doc-3",
    title: "Private Schools Operating License Application and Equality Forms",
    titleTg: "ፎርም ሕቶ ፍቓድ ስራሕ ውልቀ ኣብያተ ትምህርቲ",
    category: "Form",
    categoryTg: "ፎርም",
    fileSize: "850 KB",
    uploadedAt: "2026-05-02T09:30:00Z",
    fileUrl: "#form-private"
  },
  {
    id: "doc-4",
    title: "Tigray Education Recovery Plan Funding Status & NGO Operations Circular",
    titleTg: "ኩነታት ምውህሃድ ሓገዝን ተሳትፎ ማሕበራትን ሰነድ መምርሒ",
    category: "Circular",
    categoryTg: "ምልክታ",
    fileSize: "720 KB",
    uploadedAt: "2026-04-28T16:15:00Z",
    fileUrl: "#circular-ngo"
  }
];

const initialInquiries: ContactInquiry[] = [
  {
    id: "inq-1",
    name: "Almaz Tekle",
    email: "almaz.t@yahoo.com",
    subject: "Adwa Primary School Reconstruction Status",
    message: "I would love to know if there are budget allocations for supplying notebooks and furniture directly to our reconstruction zone in Adwa.",
    submittedAt: "2026-05-25T15:20:00Z"
  }
];

// Combine all into raw database object
interface LocalDatabase {
  users: User[];
  news: NewsItem[];
  schools: School[];
  examResults: ExamResult[];
  documents: DocumentItem[];
  inquiries: ContactInquiry[];
  auditLogs: string[];
}

function loadDatabase(): LocalDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch {
      // recovery on corrupted
    }
  }
  const defaultDb: LocalDatabase = {
    users: initialUsers,
    news: initialNews,
    schools: initialSchools,
    examResults: initialExamResults,
    documents: initialDocuments,
    inquiries: initialInquiries,
    auditLogs: ["System bootstrapped with initial seeds."]
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(db: LocalDatabase) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

let db = loadDatabase();

// Express configuration middlewares
app.use(express.json({ limit: "50mb" }));

// Security logic helper to guard routing
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired credentials token" });
  }
  (req as any).user = decoded;
  next();
}

// ---------------------- API ROUTES ----------------------

// 1. PUBLIC STATISTICS
app.get("/api/stats", (req, res) => {
  const totalSchools = db.schools.length;
  const totalEnrollment = db.schools.reduce((acc, sch) => acc + sch.studentCount, 0);
  // Average of our seeds: Kallamino (780), Atse Yohannes (1420), Adwa (950), Axum (610), Wukro (450), Maychew (1120), Shire (1250), Humera (380). Let's simulate a constant of ~78 teachers per secondary, 34 per primary
  const totalTeachers = db.schools.reduce((acc, sch) => {
    if (sch.level === 'Primary') return acc + Math.round(sch.studentCount / 38);
    if (sch.level === 'TVET') return acc + Math.round(sch.studentCount / 18);
    return acc + Math.round(sch.studentCount / 22);
  }, 0);

  res.json({
    totalSchools,
    totalEnrollment,
    totalTeachers,
    examPassRate: 74, // average regional pass rate post recovery
    academicYear: "2016-2017 EC (2025-2026 GC)"
  });
});

// 2. AUTHENTICATION LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password keys mandatory" });
  }
  const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    return res.status(401).json({ error: "User credentials matches no regional key" });
  }
  const hash = hashPassword(password);
  if (found.passwordHash !== hash) {
    return res.status(401).json({ error: "Incorrect credentials pin" });
  }
  const token = generateToken({ id: found.id, name: found.name, email: found.email, role: found.role });
  res.json({
    token,
    user: {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role
    }
  });
});

// 3. NEWS MODULE
app.get("/api/news", (req, res) => {
  res.json(db.news);
});

app.post("/api/news", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { title, titleTg, body, bodyTg, category } = req.body;
  
  if (!title || !titleTg || !body || !bodyTg || !category) {
    return res.status(400).json({ error: "All news parameters are mandatory to persist" });
  }

  const newItem: NewsItem = {
    id: `news-${Date.now()}`,
    title,
    titleTg,
    body,
    bodyTg,
    category,
    publishedAt: new Date().toISOString(),
    authorId: user.id,
    authorName: user.name
  };

  db.news.unshift(newItem);
  db.auditLogs.unshift(`[${new Date().toISOString()}] News item created by ${user.name}: "${title}"`);
  saveDatabase(db);
  res.status(201).json(newItem);
});

app.put("/api/news/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { title, titleTg, body, bodyTg, category } = req.body;
  const index = db.news.findIndex(n => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "News target not found" });
  }

  db.news[index] = {
    ...db.news[index],
    title: title ?? db.news[index].title,
    titleTg: titleTg ?? db.news[index].titleTg,
    body: body ?? db.news[index].body,
    bodyTg: bodyTg ?? db.news[index].bodyTg,
    category: category ?? db.news[index].category,
  };

  db.auditLogs.unshift(`[${new Date().toISOString()}] News item updated by ${user.name}: "${title}"`);
  saveDatabase(db);
  res.json(db.news[index]);
});

app.delete("/api/news/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const item = db.news.find(n => n.id === req.params.id);
  if (!item) return res.status(404).json({ error: "News item not found" });

  db.news = db.news.filter(n => n.id !== req.params.id);
  db.auditLogs.unshift(`[${new Date().toISOString()}] News item deleted by ${user.name}: "${item.title}"`);
  saveDatabase(db);
  res.json({ success: true });
});

// 4. SCHOOLS OPERATIONS
app.get("/api/schools", (req, res) => {
  res.json(db.schools);
});

app.post("/api/schools", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { name, nameTg, type, zone, zoneTg, woreda, woredaTg, level, studentCount } = req.body;

  if (!name || !nameTg || !type || !zone || !zoneTg || !woreda || !woredaTg || !level || studentCount === undefined) {
    return res.status(400).json({ error: "All school parameters are mandatory" });
  }

  const newSchool: School = {
    id: `sch-${Date.now()}`,
    name,
    nameTg,
    type,
    zone,
    zoneTg,
    woreda,
    woredaTg,
    level,
    studentCount: Number(studentCount)
  };

  db.schools.push(newSchool);
  db.auditLogs.unshift(`[${new Date().toISOString()}] School registered by ${user.name}: "${name}"`);
  saveDatabase(db);
  res.status(201).json(newSchool);
});

app.put("/api/schools/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { name, nameTg, type, zone, zoneTg, woreda, woredaTg, level, studentCount } = req.body;
  const index = db.schools.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "School record not found" });
  }

  db.schools[index] = {
    ...db.schools[index],
    name: name ?? db.schools[index].name,
    nameTg: nameTg ?? db.schools[index].nameTg,
    type: type ?? db.schools[index].type,
    zone: zone ?? db.schools[index].zone,
    zoneTg: zoneTg ?? db.schools[index].zoneTg,
    woreda: woreda ?? db.schools[index].woreda,
    woredaTg: woredaTg ?? db.schools[index].woredaTg,
    level: level ?? db.schools[index].level,
    studentCount: studentCount !== undefined ? Number(studentCount) : db.schools[index].studentCount,
  };

  db.auditLogs.unshift(`[${new Date().toISOString()}] School record edited by ${user.name}: "${name}"`);
  saveDatabase(db);
  res.json(db.schools[index]);
});

app.delete("/api/schools/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const school = db.schools.find(s => s.id === req.params.id);
  if (!school) return res.status(404).json({ error: "School not found" });

  db.schools = db.schools.filter(s => s.id !== req.params.id);
  db.auditLogs.unshift(`[${new Date().toISOString()}] School deleted by ${user.name}: "${school.name}"`);
  saveDatabase(db);
  res.json({ success: true });
});

// 5. EXAMINATIONS MODULE
app.get("/api/exam_results", (req, res) => {
  res.json(db.examResults);
});

app.get("/api/exam_results/:studentId", (req, res) => {
  const result = db.examResults.find(
    r => r.studentId.trim().toUpperCase() === req.params.studentId.trim().toUpperCase()
  );
  if (!result) {
    return res.status(404).json({ error: "Student assessment not filed in regional registry" });
  }
  res.json(result);
});

// CSV parser input upload
app.post("/api/exam_results/upload", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { results } = req.body; // Expect parsed or raw arrays
  if (!Array.isArray(results)) {
    return res.status(400).json({ error: "Results package must be an array of objects" });
  }

  const loaded: ExamResult[] = [];
  results.forEach((item, index) => {
    const studentId = item.studentId || `TRE-UP-${Date.now()}-${index}`;
    const studentName = item.studentName || "Uploaded Student";
    const studentNameTg = item.studentNameTg || "ሕሉፍ ተምሃራይ";
    const year = Number(item.year) || 2016;
    const gradeLevel = Number(item.gradeLevel) || 12;
    const schoolName = item.schoolName || "Regional High School";
    const schoolNameTg = item.schoolNameTg || "ንኡስ ካልኣይ ብርኪ ቤት ትምህርቲ";
    const rawScores = item.subjectScores || { "English": 75, "Mathematics": 80, "Tigrinya": 85 };
    
    // Calculate total
    const subjectScores: Record<string, number> = {};
    let totalScore = 0;
    Object.keys(rawScores).forEach(sub => {
      const val = Number(rawScores[sub]) || 0;
      subjectScores[sub] = val;
      totalScore += val;
    });

    const maxMultiplier = Object.keys(subjectScores).length;
    const maxPossible = maxMultiplier * 100;
    const passThreshold = maxPossible * 0.50; // 50% threshold

    const finalItem: ExamResult = {
      id: `res-loaded-${Date.now()}-${index}`,
      studentId,
      studentName,
      studentNameTg,
      year,
      gradeLevel: gradeLevel as 8 | 10 | 12,
      schoolName,
      schoolNameTg,
      subjectScores,
      total: totalScore,
      maxPossible,
      passed: totalScore >= passThreshold
    };

    // Replace if exists, or push
    const existIndex = db.examResults.findIndex(r => r.studentId.trim().toUpperCase() === studentId.trim().toUpperCase());
    if (existIndex !== -1) {
      db.examResults[existIndex] = finalItem;
    } else {
      db.examResults.push(finalItem);
    }
    loaded.push(finalItem);
  });

  db.auditLogs.unshift(`[${new Date().toISOString()}] Exam results block containing ${loaded.length} records processed by ${user.name}`);
  saveDatabase(db);
  res.json({ success: true, count: loaded.length, records: loaded });
});

app.delete("/api/exam_results/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  db.examResults = db.examResults.filter(r => r.id !== req.params.id);
  db.auditLogs.unshift(`[${new Date().toISOString()}] Exam result record entry ${req.params.id} deleted by ${user.name}`);
  saveDatabase(db);
  res.json({ success: true });
});

// 6. DOCUMENTS MANAGER
app.get("/api/documents", (req, res) => {
  res.json(db.documents);
});

app.post("/api/documents", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { title, titleTg, category, categoryTg, fileSize, fileUrl } = req.body;

  if (!title || !titleTg || !category || !categoryTg) {
    return res.status(400).json({ error: "Document fields titles and categories are required" });
  }

  const newDoc: DocumentItem = {
    id: `doc-${Date.now()}`,
    title,
    titleTg,
    category,
    categoryTg,
    fileSize: fileSize || "1.2 MB",
    uploadedAt: new Date().toISOString(),
    fileUrl: fileUrl || "#download-simulated"
  };

  db.documents.unshift(newDoc);
  db.auditLogs.unshift(`[${new Date().toISOString()}] Bureau circular published by ${user.name}: "${title}"`);
  saveDatabase(db);
  res.status(201).json(newDoc);
});

app.delete("/api/documents/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const doc = db.documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  db.documents = db.documents.filter(d => d.id !== req.params.id);
  db.auditLogs.unshift(`[${new Date().toISOString()}] Bureau document deleted by ${user.name}: "${doc.title}"`);
  saveDatabase(db);
  res.json({ success: true });
});

// 7. USER MANAGEMENT ACCESS KEYS
app.get("/api/users", requireAuth, (req, res) => {
  // Strip pass hashes for client
  const parsed = db.users.map(({ id, name, email, role }) => ({ id, name, email, role }));
  res.json(parsed);
});

app.post("/api/users", requireAuth, (req, res) => {
  const requester = (req as any).user;
  if (requester.role !== "Super Admin") {
    return res.status(403).json({ error: "Only Super Admins can manage bureau access keys" });
  }

  const { name, email, role, password } = req.body;
  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "All registration parameters are mandatory" });
  }

  const exist = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exist) {
    return res.status(409).json({ error: "Email already registered in bureau directories" });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role,
    passwordHash: hashPassword(password)
  };

  db.users.push(newUser);
  db.auditLogs.unshift(`[${new Date().toISOString()}] Institutional User ${name} (${role}) added by Super Admin ${requester.name}`);
  saveDatabase(db);
  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
});

app.delete("/api/users/:id", requireAuth, (req, res) => {
  const requester = (req as any).user;
  if (requester.role !== "Super Admin") {
    return res.status(403).json({ error: "Only Super Admins can manage bureau access keys" });
  }

  if (req.params.id === requester.id) {
    return res.status(400).json({ error: "Self-deletion of operational superkey is barred" });
  }

  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  db.users = db.users.filter(u => u.id !== req.params.id);
  db.auditLogs.unshift(`[${new Date().toISOString()}] Bureau key for ${user.name} revoked by Super Admin ${requester.name}`);
  saveDatabase(db);
  res.json({ success: true });
});

// 8. CONTACT FORM SUBMISSION
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All contact fields are required to route complaints" });
  }

  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry);
  // Add to audits too
  db.auditLogs.unshift(`[${new Date().toISOString()}] New public inquiry submitted by ${name}: "${subject}"`);
  saveDatabase(db);
  res.status(201).json(newInquiry);
});

app.get("/api/inquiries", requireAuth, (req, res) => {
  res.json(db.inquiries);
});

app.delete("/api/inquiries/:id", requireAuth, (req, res) => {
  db.inquiries = db.inquiries.filter(i => i.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// 9. AUDIT LOGS
app.get("/api/audit-logs", requireAuth, (req, res) => {
  res.json(db.auditLogs);
});

// ---------------------- VITE / PROD ASSETS STATIC MIDDLEWARE ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tigray REO Server] running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV === "production" ? "PROD" : "DEV"} mode`);
  });
}

startServer();
