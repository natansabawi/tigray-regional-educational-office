import { ShieldAlert, CheckCircle2, Cloud } from 'lucide-react';
import { Language, translations } from '../translations';

interface FooterProps {
  currentLang: Language;
  setActiveTab: (tab: string) => void;
}

export default function Footer({ currentLang, setActiveTab }: FooterProps) {
  const t = translations[currentLang];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-4 md:px-12 text-xs shrink-0 relative mt-auto">
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0">
        <div className="habesha-border"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Unit Identity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">★</span>
            <span className="font-serif font-black tracking-tight text-white uppercase text-sm">
              {t.title}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-75 max-w-sm mb-4">
            {t.subTitle}
          </p>
          <div className="text-[10px] uppercase text-accent-amber font-semibold tracking-wider font-mono">
            {t.officeAddressVal}
          </div>
        </div>

        {/* Quick Help Portals */}
        <div className="md:ml-auto">
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
            {currentLang === 'en' ? 'Quick Information Portals' : 'ቅልጡፍ መተሓላለፊ ሓበሬታ'}
          </h4>
          <ul className="space-y-2 text-[11px] font-medium">
            <li>
              <button onClick={() => setActiveTab('schools')} className="hover:text-accent-amber transition uppercase duration-150">
                {t.navSchools}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('exams')} className="hover:text-accent-amber transition uppercase duration-150">
                {t.navExams}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('docs')} className="hover:text-accent-amber transition uppercase duration-150">
                {t.navDocs}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-accent-amber transition uppercase duration-150">
                {t.navContact}
              </button>
            </li>
          </ul>
        </div>

        {/* Strategic Partnerships */}
        <div className="md:ml-auto">
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
            {currentLang === 'en' ? 'Institutional Directives' : 'ወግዓዊ መምርሒታት'}
          </h4>
          <p className="text-[11px] leading-relaxed opacity-75 max-w-sm">
            {currentLang === 'en'
              ? 'Tigray Regional Education Office works under regional recovery councils. For verification of credentials or certificates, please contact our Exams Directorate directly.'
              : 'ቢሮ ትምህርቲ ክልል ትግራይ ኣብ ሓፈሻዊ ዳግመ-ህንፀት ዝነጥፍ ትካል እዩ። ምስክር ወረቐት ንምርግጋፅ ብቀጥታ ንዳይሬክቶሬት ፈተናታት የዘራርቡ።'}
          </p>
          <div className="mt-4 flex gap-4">
            <span className="text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded">
              Ethiopian Calendar: 2016 E.C.
            </span>
            <span className="text-[10px] text-white/50 border border-white/10 px-2 py-0.5 rounded">
              G.C. Year: 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-[1px] bg-slate-800 my-6"></div>

      {/* Footer base metadata and system logs status */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div className="flex flex-wrap gap-4 items-center">
          <span>&copy; {year} {t.title}. All Rights Reserved.</span>
          <span className="text-slate-600">|</span>
          <button onClick={() => setActiveTab('about')} className="hover:text-white transition">{t.navAbout}</button>
          <span className="text-slate-600">|</span>
          <button onClick={() => setActiveTab('admin')} className="hover:text-white text-accent-amber transition">Bureau System Access</button>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-mono tracking-tighter shrink-0 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />
            SECURE REST-API ONLINE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Cloud size={11} /> Cloud Run Host
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">v1.1.2</span>
        </div>
      </div>
    </footer>
  );
}
