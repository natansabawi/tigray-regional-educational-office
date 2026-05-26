import React, { useState } from 'react';
import { 
  Award, Search, Printer, AlertTriangle, HelpCircle, 
  CheckCircle2, XCircle, FileSpreadsheet, Sparkles 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { ExamResult } from '../types';
import { api } from '../api';

interface ExamsSectionProps {
  currentLang: Language;
}

export default function ExamsSection({ currentLang }: ExamsSectionProps) {
  const t = translations[currentLang];
  const [studentId, setStudentId] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(12);
  const [examYear, setExamYear] = useState<number>(2016);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError(currentLang === 'en' ? 'Please enter a Student Roll number.' : 'በጃኹም ቑፅሪ እታው የእትዉ።');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.lookupExam(studentId.trim());
      // Validate returned year or grade if required, but primarily display matching ID
      setResult(data);
    } catch (err: any) {
      setError(t.examNotFound);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="bg-slate-50 py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[600px]">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Assessment Results' : 'ፈተናታትን ዳይሬክቶሬትን'}</span>
        <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
          {t.examPortalTitle}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          {t.examPortalSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Lookup Terminal Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm lg:col-span-1">
          <h3 className="font-serif text-lg font-bold text-primary-navy mb-4 flex items-center gap-1.5">
            <Award className="text-accent-amber shrink-0" size={18} />
            {currentLang === 'en' ? 'Search Terminal' : 'ዝርዝር ውፅኢት ድለ'}
          </h3>

          <form onSubmit={handleLookup} className="space-y-4">
            {/* Exam Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                {t.examGradeLevel}
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold text-slate-700"
              >
                <option value={8}>Primary School Leaving (Grade 8) — 8ይ ክፍሊ</option>
                <option value={10}>Regional Assessment (Grade 10) — 10ይ ክፍሊ</option>
                <option value={12}>University Entrance (Grade 12) — 12ይ ክፍሊ</option>
              </select>
            </div>

            {/* Exam Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                {t.examYear}
              </label>
              <select
                value={examYear}
                onChange={(e) => setExamYear(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold text-slate-700"
              >
                <option value={2016}>2016 E.C. (Current Academic Cycle)</option>
                <option value={2015}>2015 E.C.</option>
                <option value={2014}>2014 E.C.</option>
              </select>
            </div>

            {/* Student Roll ID */}
            <div className="space-y-1.5ClassName">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Roll Number / Student ID
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. TRE-40918 or TRE-80321"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold"
                />
              </div>
            </div>

            {/* Status alerts */}
            {error && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-lg flex gap-2 font-medium">
                <AlertTriangle size={16} className="text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-navy text-accent-amber py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#123154] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{currentLang === 'en' ? 'Verifying...' : 'ይረጋገፅ ኣሎ...'}</span>
              ) : (
                <>
                  <FileSpreadsheet size={14} />
                  <span>{t.lookupButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick instructions box */}
          <div className="p-3 bg-blue-50 text-blue-800 border-l-4 border-blue-500 rounded-r text-[11px] leading-relaxed mt-6 flex gap-2">
            <span className="shrink-0 font-bold">ⓘ</span>
            <span>
              {currentLang === 'en' 
                ? 'Test Roll IDs are pre-seeded in this system (e.g., TRE-40918, TRE-40919 for Grade 12 or TRE-80321, TRE-80322 for Grade 8). Input them to retrieve instant scores.'
                : 'ቅድም ተመዝጊቦም ዘለዉ ናሙናታት (ንኣብነት TRE-40918 ወይ TRE-80321) የእትዉ።'}
            </span>
          </div>
        </div>

        {/* Display Sheet Report Panel */}
        <div className="lg:col-span-2">
          {result ? (
            <div id="exam-print-section" className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden animate-in fade-in duration-200">
              
              {/* Ge'ez style border strip inside card */}
              <div className="habesha-border absolute top-0 left-0 right-0"></div>

              <div>
                {/* Transcript Title */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] text-accent-amber font-mono font-bold tracking-widest uppercase block">
                      OFFICIAL TRANSCRIPT SHEET
                    </span>
                    <h4 className="font-serif text-lg font-black text-primary-navy mt-1">
                      {t.resultFor} {result.studentId}
                    </h4>
                  </div>
                  
                  <button 
                    onClick={handlePrint}
                    className="p-1 px-3 border border-slate-200 hover:bg-slate-100 text-primary-navy text-xs rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Printer size={13} />
                    <span>{currentLang === 'en' ? 'Print' : 'ሕተም'}</span>
                  </button>
                </div>

                {/* Score Summary Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-xs font-semibold">
                  <div className="space-y-2">
                    <div className="text-slate-400 uppercase text-[10px]">{t.resultName}</div>
                    <div className="text-sm font-bold text-primary-navy">{currentLang === 'en' ? result.studentName : result.studentNameTg}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-400 uppercase text-[10px]">{t.resultSchool}</div>
                    <div className="text-sm font-bold text-primary-navy">{currentLang === 'en' ? result.schoolName : result.schoolNameTg}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-400 uppercase text-[10px]">{t.examGradeLevel}</div>
                    <div className="text-sm font-bold text-primary-navy">Grade {result.gradeLevel} (ክፍሊ {result.gradeLevel})</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-400 uppercase text-[10px]">{t.examYear}</div>
                    <div className="text-sm font-bold text-primary-navy">{result.year} E.C.</div>
                  </div>
                </div>

                {/* Performance Table */}
                <h5 className="font-serif font-bold text-primary-navy text-sm mb-3">
                  {t.scoreBreakdown}
                </h5>

                <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 text-xs md:text-sm">
                  <table className="w-full text-left font-medium text-slate-700">
                    <thead className="bg-slate-100 font-bold text-slate-600 text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Course / Subject Name</th>
                        <th className="p-3 text-right">Score achieved</th>
                        <th className="p-3 text-right">Maximum Possible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.keys(result.subjectScores).map((sub) => (
                        <tr key={sub}>
                          <td className="p-3 font-semibold text-primary-navy">{sub}</td>
                          <td className="p-3 text-right font-mono font-bold">{result.subjectScores[sub]}</td>
                          <td className="p-3 text-right font-mono text-slate-400">100</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-300">
                        <td className="p-3 text-primary-navy">{t.totalScore}</td>
                        <td className="p-3 text-right font-mono text-primary-navy text-base">{result.total}</td>
                        <td className="p-3 text-right font-mono text-slate-400">{result.maxPossible}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verified Pass footer status */}
              <div className={`p-4 rounded-xl flex items-center justify-between border ${
                result.passed 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-500 shrink-0" />
                  )}
                  <div>
                    <span className="block font-black text-xs uppercase tracking-wide">
                      {result.passed ? (currentLang === 'en' ? 'PASSED & DIRECTED' : 'ሓሊፉ') : (currentLang === 'en' ? 'FAILED' : 'ኣይሓለፎን')}
                    </span>
                    <span className="text-[10px] opacity-75">
                      {result.passed 
                        ? (currentLang === 'en' ? 'Passed with distinction' : 'ብሉፅ ውፅኢት ብምምዝጋብ ሓሊፉ ኣሎ።') 
                        : (currentLang === 'en' ? 'Below regional 50% limit' : 'ካብቲ ዝተቐመጠ ትሑት ነጥቢ ንታሕቲ እዩ።')}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-white p-2 border border-slate-200 rounded shadow-inner uppercase tracking-widest leading-none font-bold shrink-0">
                  Seal Verified 
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-semibold min-h-[400px] flex flex-col justify-center items-center">
              <HelpCircle size={48} className="text-slate-200 mb-4" />
              <h4 className="font-serif text-lg font-bold text-primary-navy mb-2">
                {currentLang === 'en' ? 'Ready for Student Query' : 'ተምሃሮ ባዕልኹም ፈትሹ'}
              </h4>
              <p className="text-slate-400 text-xs md:text-sm max-w-sm">
                {currentLang === 'en' 
                  ? 'Fill out an active student Roll ID on the left and submit to view certified school transcripts.'
                  : 'በጃኹም ሓበሬታ ቑፅሪ ተፈታሒ ኣእቲኹም ኣረጋግፁ።'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
