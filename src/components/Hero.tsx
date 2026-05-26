import { useEffect, useState } from 'react';
import { 
  Building2, Users, GraduationCap, TrendingUp, Sparkles, ChevronRight, Award, FileText 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { SystemStats, NewsItem } from '../types';

interface HeroProps {
  currentLang: Language;
  stats: SystemStats | null;
  news: NewsItem[];
  setActiveTab: (tab: string) => void;
  onSelectNews: (item: NewsItem) => void;
}

export default function Hero({
  currentLang,
  stats,
  news,
  setActiveTab,
  onSelectNews
}: HeroProps) {
  const t = translations[currentLang];
  const [tickerIndex, setTickerIndex] = useState(0);

  // Rotate/tick latest announcements
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news]);

  const activeTickerNews = news[tickerIndex];

  return (
    <div className="flex flex-col shrink-0">
      {/* Ticker Banner */}
      {activeTickerNews && (
        <div className="bg-tigray-red text-white py-2 px-4 flex items-center gap-3 overflow-hidden text-xs md:text-sm font-semibold border-b border-white/20">
          <span className="bg-white text-tigray-red px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 animate-pulse">
            {t.heroAnnouncementTitle}
          </span>
          <div className="flex-1 cursor-pointer truncate font-medium hover:underline text-white/95" onClick={() => onSelectNews(activeTickerNews)}>
            {currentLang === 'en' ? activeTickerNews.title : activeTickerNews.titleTg}
          </div>
          <button 
            onClick={() => setActiveTab('news')}
            className="text-[10px] uppercase text-accent-amber font-bold hover:text-white shrink-0 flex items-center gap-0.5"
          >
            {currentLang === 'en' ? 'All' : 'ኩሉ'} <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Main Hero Container */}
      <section className="bg-primary-navy text-white relative py-12 px-6 md:px-12 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle Decorative Background Lines representing educational architecture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none habesha-pattern-bg"></div>
        <div className="absolute top-0 right-0 w-96 h-full opacity-5 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 2px, transparent 0, transparent 40px)", backgroundSize: "40px 40px" }}></div>

        <div className="max-w-4xl text-center relative z-10 mx-auto">
          {/* Tag Title */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-accent-amber border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} />
            {currentLang === 'en' ? 'Bureau of Education — Recovery & Innovation' : 'ስርዓተ ትምህርቲ ዳግመ-ህንፀትን ቴክኖሎጂን'}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {currentLang === 'en' ? 'Rebuilding the Future' : 'ንህነፅ ፅኑዕ ፅባሕ'}<br/>
            <span className="text-accent-amber">
              {currentLang === 'en' ? 'Through Quality Education.' : 'ብዘበናዊን ፅሬቱ ዝሓለወን ትምህርቲ።'}
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed mb-8 mx-auto font-medium">
            {t.subTitle}
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={() => setActiveTab('exams')}
              className="bg-accent-amber text-primary-navy px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-primary-navy shadow-lg transition duration-200 transform hover:-translate-y-0.5"
            >
              📊 {t.navExams}
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/25 transition duration-200"
            >
              🏫 {t.navSchools}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="bg-[#123154] hover:bg-[#1a416d] text-slate-200 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition"
            >
              📖 {t.navAbout}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid Overlay inside Hero bottom */}
        <div className="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-white/5 border border-white/10 p-5 rounded-2xl relative z-1s shadow-xl">
          {/* Schools */}
          <div className="p-3 bg-[#0a1e33] border-l-4 border-accent-amber rounded-r flex items-center gap-3">
            <div className="p-2.5 bg-accent-amber/10 rounded-lg text-accent-amber shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <span className="block text-xl xl:text-3xl font-black text-white">
                {stats ? stats.totalSchools : '8+'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {t.heroStatSchools}
              </span>
            </div>
          </div>

          {/* Enrollment */}
          <div className="p-3 bg-[#0a1e33] border-l-4 border-tigray-red rounded-r flex items-center gap-3">
            <div className="p-2.5 bg-tigray-red/10 rounded-lg text-tigray-red shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="block text-xl xl:text-3xl font-black text-white">
                {stats ? (stats.totalEnrollment).toLocaleString() : '6,920+'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {t.heroStatStudents}
              </span>
            </div>
          </div>

          {/* Teachers */}
          <div className="p-3 bg-[#0a1e33] border-l-4 border-emerald-500 rounded-r flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="block text-xl xl:text-3xl font-black text-white">
                {stats ? (stats.totalTeachers).toLocaleString() : '310+'}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {t.heroStatTeachers}
              </span>
            </div>
          </div>

          {/* Pass Rate */}
          <div className="p-3 bg-[#0a1e33] border-l-4 border-amber-400 rounded-r flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/10 rounded-lg text-amber-400 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="block text-xl xl:text-3xl font-black text-white">
                {stats ? stats.examPassRate : '74'}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {t.heroStatPass}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mission & Vision Layout Block */}
      <section className="bg-slate-50 py-12 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        {/* Mission Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 outline-offset-4 outline-2 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-accent-amber/15 text-primary-navy rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              ⚔️
            </div>
            <h3 className="font-serif text-xl font-extrabold text-primary-navy mb-3">
              {t.missionTitle}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 font-medium">
              {t.missionText}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('about')}
            className="text-xs font-bold text-primary-navy hover:text-accent-amber uppercase flex items-center gap-1"
          >
            {currentLang === 'en' ? 'Our History' : 'ታሪኽና ርኣዩ'} <ChevronRight size={14} />
          </button>
        </div>

        {/* Vision Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-tigray-red/10 text-tigray-red rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              🔭
            </div>
            <h3 className="font-serif text-xl font-extrabold text-primary-navy mb-3">
              {t.visionTitle}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 font-medium">
              {t.visionText}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('programs')}
            className="text-xs font-bold text-primary-navy hover:text-accent-amber uppercase flex items-center gap-1"
          >
            {currentLang === 'en' ? 'Core Support Programs' : 'ድጋፍ ፕሮግራማት'} <ChevronRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
