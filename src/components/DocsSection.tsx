import { useState } from 'react';
import { Search, FileText, Download, Tag, Calendar, AlertCircle } from 'lucide-react';
import { Language, translations } from '../translations';
import { DocumentItem } from '../types';

interface DocsSectionProps {
  currentLang: Language;
  documents: DocumentItem[];
}

export default function DocsSection({ currentLang, documents }: DocsSectionProps) {
  const t = translations[currentLang];
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = [
    { key: 'All', label: t.categoryAll },
    { key: 'Circular', label: currentLang === 'en' ? 'Circulars' : 'ምልክታታት' },
    { key: 'Curriculum Guide', label: currentLang === 'en' ? 'Curricula' : 'ስርዓተ ትምህርቲ' },
    { key: 'Form', label: currentLang === 'en' ? 'Application Forms' : 'ፎርማት ማመልከቻ' },
    { key: 'Policy Document', label: currentLang === 'en' ? 'Policy & Guidelines' : 'መዛዘሚታት' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const titleText = currentLang === 'en' ? doc.title : doc.titleTg;
    const matchesSearch = titleText.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || doc.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSimulatedDownload = (doc: DocumentItem) => {
    // Generate simple simulated client download text/HTML block
    const textContent = `Official Tigray Bureau of Education Document\nTitle: ${doc.title}\nTigrinya Title: ${doc.titleTg}\nCategory: ${doc.category}\nPublished At: ${doc.uploadedAt}\nFile URL Pointer: ${doc.fileUrl}\nVerified digital signature: TRUE\n[End of File Output]`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, "_")}_TREO.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-slate-50 py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[600px]">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Bureau Repository' : 'ማህደር ሰነዳት'}</span>
        <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
          {t.docsTitle}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          {t.docsSub}
        </p>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                category === cat.key
                  ? 'bg-primary-navy text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchDocs}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold"
          />
        </div>
      </div>

      {/* Grid listing files */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-sm mx-auto my-12">
          <span className="text-xl">📭</span>
          <p className="text-slate-500 text-xs font-bold mt-2">No documents found matching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition duration-200 shadow-sm justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0 mt-1">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-black text-primary-navy text-sm md:text-base leading-snug">
                    {currentLang === 'en' ? doc.title : doc.titleTg}
                  </h4>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {doc.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      Size: {doc.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSimulatedDownload(doc)}
                title={t.downloadPdf}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-primary-navy p-2.5 rounded-xl transition duration-150 shrink-0 self-center"
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Document Warning Advisory */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs flex gap-3 text-blue-800 leading-normal mt-4">
        <AlertCircle size={18} className="text-blue-600 shrink-0" />
        <div>
          <span className="font-bold underline">Avisory of Authorization:</span> {currentLang === 'en'
            ? 'Only circulars with digital encryption credentials are legally valid. All downloaded pdf files reflect state security seal markings.'
            : 'ሕጋዊ ኣሳልጦ ንዘለዎም ፎርማት ጥራሕ ይጥቀሙ። ኩሎም ወግዓውያን ሰነዳት ናይ ቢሮ ዲጂታል ክታምን ማህተምን ዘለዎም እዮም::'}
        </div>
      </div>
    </section>
  );
}
