export type UserRole = 'Super Admin' | 'Regional Officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string; // Hidden in normal API calls
}

export interface NewsItem {
  id: string;
  title: string;
  titleTg: string;
  body: string;
  bodyTg: string;
  category: 'Policy' | 'Exams' | 'Scholarships' | 'Events';
  publishedAt: string;
  authorId: string;
  authorName: string;
}

export type SchoolLevel = 'Primary' | 'Secondary' | 'TVET' | 'Higher';
export type SchoolType = 'Public' | 'Private';

export interface School {
  id: string;
  name: string;
  nameTg: string;
  type: SchoolType;
  zone: string;
  zoneTg: string;
  woreda: string;
  woredaTg: string;
  level: SchoolLevel;
  studentCount: number;
}

export interface SubjectScores {
  [subject: string]: number;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  studentNameTg: string;
  year: number; // e.g. 2016 (Ethiopian Calendar)
  gradeLevel: 8 | 10 | 12;
  schoolName: string;
  schoolNameTg: string;
  subjectScores: SubjectScores;
  total: number;
  maxPossible: number;
  passed: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  titleTg: string;
  category: 'Circular' | 'Curriculum Guide' | 'Form' | 'Policy Document';
  categoryTg: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl: string; // Dynamic simulated base64 or link
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

// Global System Statistics
export interface SystemStats {
  totalSchools: number;
  totalEnrollment: number;
  totalTeachers: number;
  examPassRate: number; // in percentage e.g. 74
  academicYear: string;
}
