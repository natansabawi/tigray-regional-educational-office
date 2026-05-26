import { 
  User, 
  NewsItem, 
  School, 
  ExamResult, 
  DocumentItem, 
  ContactInquiry, 
  SystemStats 
} from "./types";

const BASE_URL = ""; // Relative paths will hit our Express server on port 3000

function getHeaders(isAuthenticated = false): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (isAuthenticated) {
    const token = localStorage.getItem("treo_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

// Custom error wrapper
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  authRequired = false
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: getHeaders(authRequired),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new ApiError(errBody.error || "An unexpected system error occurred", response.status);
    }

    if (method === "DELETE") {
      return { success: true } as unknown as T;
    }

    return await response.json() as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error.message || "Network connection failure");
  }
}

export const api = {
  // Public stats
  getStats: () => request<SystemStats>("/api/stats"),

  // Auth
  login: (credentials: { email: string; password?: string }) => 
    request<{ token: string; user: User }>("/api/auth/login", "POST", credentials),

  // News
  getNews: () => request<NewsItem[]>("/api/news"),
  createNews: (news: Omit<NewsItem, "id" | "publishedAt" | "authorId" | "authorName">) => 
    request<NewsItem>("/api/news", "POST", news, true),
  updateNews: (id: string, news: Partial<NewsItem>) => 
    request<NewsItem>(`/api/news/${id}`, "PUT", news, true),
  deleteNews: (id: string) => 
    request<any>(`/api/news/${id}`, "DELETE", undefined, true),

  // Schools
  getSchools: () => request<School[]>("/api/schools"),
  createSchool: (school: Omit<School, "id">) => 
    request<School>("/api/schools", "POST", school, true),
  updateSchool: (id: string, school: Partial<School>) => 
    request<School>(`/api/schools/${id}`, "PUT", school, true),
  deleteSchool: (id: string) => 
    request<any>(`/api/schools/${id}`, "DELETE", undefined, true),

  // Exam Results
  lookupExam: (studentId: string) => 
    request<ExamResult>(`/api/exam_results/${studentId}`),
  uploadExamResults: (results: any[]) => 
    request<{ success: boolean; count: number }>("/api/exam_results/upload", "POST", { results }, true),
  deleteExamResult: (id: string) => 
    request<any>(`/api/exam_results/${id}`, "DELETE", undefined, true),

  // Documents
  getDocuments: () => request<DocumentItem[]>("/api/documents"),
  createDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt">) => 
    request<DocumentItem>("/api/documents", "POST", doc, true),
  deleteDocument: (id: string) => 
    request<any>(`/api/documents/${id}`, "DELETE", undefined, true),

  // Public Inquiries
  submitInquiry: (inquiry: Omit<ContactInquiry, "id" | "submittedAt">) => 
    request<ContactInquiry>("/api/contact", "POST", inquiry),
  getInquiries: () => 
    request<ContactInquiry[]>("/api/inquiries", "GET", undefined, true),
  deleteInquiry: (id: string) => 
    request<any>(`/api/inquiries/${id}`, "DELETE", undefined, true),

  // Logs
  getAuditLogs: () =>
    request<string[]>("/api/audit-logs", "GET", undefined, true),
    
  // Officers / Users Keys (Super Admin only)
  getUsers: () => request<User[]>("/api/users", "GET", undefined, true),
  createUser: (user: Omit<User, "id"> & { password?: string }) => 
    request<User>("/api/users", "POST", user, true),
  deleteUser: (id: string) => 
    request<any>(`/api/users/${id}`, "DELETE", undefined, true),
};
