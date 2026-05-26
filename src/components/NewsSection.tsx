import { useState } from 'react';
import { Search, Calendar, User, Eye, ArrowRight, Tag } from 'lucide-react';
import { Language, translations } from '../translations';
import { NewsItem } from '../types';

interface NewsSectionProps {
  currentLang: Language;
  news: NewsItem[];
  selectedNews: NewsItem | null;
  setSelectedNews: (item: NewsItem | null) => void;
}

export default function NewsSection({
  currentLang,
  news,
  selectedNews,
  setSelectedNews
}: NewsSectionProps) {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { key: 'All', label: t.categoryAll },
    { key: 'Policy', label: t.categoryPolicy },
    { key: 'Exams', label: t.categoryExams },
    { key: 'Scholarships', label: t.categoryScholarships },
    { key: 'Events', label: t.categoryEvents },
  ];

  // Filtering news items based on active actions
  const filteredNews = news.filter((item) => {
    const titleText = currentLang === 'en' ? item.title : item.titleTg;
    const bodyText = currentLang === 'en' ? item.body : item.bodyTg;
    const matchesSearch = 
      titleText.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bodyText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-slate-50 py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[600px]">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Regional Updates' : 'ቆጻሪ ብስራት'}</span>
          <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
            {t.recentNews}
          </h2>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchNews}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-xs md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-navy"
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition duration-150 ${
              activeCategory === cat.key
                ? 'bg-primary-navy text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 max-w-md mx-auto my-12">
          <p className="text-slate-500 text-sm font-semibold">{t.noNewsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredNews.map((item) => {
            const date = new Date(item.publishedAt).toLocaleDateString(
              currentLang === 'en' ? 'en-US' : 'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' }
            );

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                {/* Accent Top Lip matching category */}
                <div className={`h-1.5 ${
                  item.category === 'Exams' ? 'bg-tigray-red' :
                  item.category === 'Policy' ? 'bg-primary-navy' :
                  item.category === 'Scholarships' ? 'bg-accent-amber' : 'bg-emerald-500'
                }`}></div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {/* Meta Labels */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-accent-amber">
                        <Tag size={12} />
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-extrabold text-primary-navy leading-snug hover:text-accent-amber cursor-pointer mb-2" onClick={() => setSelectedNews(item)}>
                      {currentLang === 'en' ? item.title : item.titleTg}
                    </h3>

                    <p className="text-slate-600 text-xs md:text-sm line-clamp-3 leading-relaxed font-medium">
                      {currentLang === 'en' ? item.body : item.bodyTg}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <User size={12} />
                      <span className="max-w-[120px] truncate">{item.authorName}</span>
                    </div>

                    <button
                      onClick={() => setSelectedNews(item)}
                      className="text-xs font-bold text-primary-navy hover:text-accent-amber uppercase tracking-wider flex items-center gap-1 shrink-0"
                    >
                      {currentLang === 'en' ? 'Read Full Announcement' : 'ምሉእ ሓበሬታ ኣንብብ'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* POPUP MODAL DETAILED NEWS OVERLAY */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-t-8 border-accent-amber">
            {/* Habesha Accent Strip and Close button */}
            <div className="absolute top-2 right-4 z-10">
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Category tag */}
              <span className="inline-block bg-primary-navy/10 text-primary-navy font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                Category: {selectedNews.category}
              </span>

              {/* Title english & tigrinya display */}
              <h2 className="font-serif text-xl md:text-3xl font-black text-primary-navy leading-tight mb-4">
                {currentLang === 'en' ? selectedNews.title : selectedNews.titleTg}
              </h2>

              {/* English text (if toggled) and alternative toggle container text */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(selectedNews.publishedAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User size={12} />
                  Published by: {selectedNews.authorName}
                </span>
              </div>

              {/* Main Content Paragraphs */}
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-semibold">
                <div className="p-4 bg-slate-50 border-l-4 border-accent-amber rounded-r text-xs italic text-slate-500 mb-6">
                  {currentLang === 'en' ? 'Tigrinya Version:' : 'English Translation:'} <br />
                  <span className="not-italic text-sm font-sans text-slate-700 block mt-2">
                    {currentLang === 'en' ? selectedNews.bodyTg : selectedNews.body}
                  </span>
                </div>

                <p className="text-base font-medium">{currentLang === 'en' ? selectedNews.body : selectedNews.bodyTg}</p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="bg-primary-navy text-white px-6 py-2 rounded-lg font-bold text-xs uppercase"
                >
                  {currentLang === 'en' ? 'Close View' : 'ዕፀው'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
