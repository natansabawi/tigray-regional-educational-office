import { Landmark, Users2, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Language, translations } from '../translations';

interface AboutSectionProps {
  currentLang: Language;
}

export default function AboutSection({ currentLang }: AboutSectionProps) {
  const t = translations[currentLang];

  const leaders = [
    {
      name: currentLang === 'en' ? 'Dr. Kiros Hagos' : 'ዶ/ር ኪሮስ ሃጎስ',
      role: t.roleBureauHead,
      email: 'kiros.hagos@tigrayedu.gov.et',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200', // Professional placeholder
    },
    {
      name: currentLang === 'en' ? 'Mulugeta Assefa' : 'ሙሉጌታ ኣሰፋ',
      role: t.roleDeputyHead,
      email: 'mulugeta.a@tigrayedu.gov.et',
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: currentLang === 'en' ? 'Almaz Berhe' : 'ኣልማዝ በርሀ',
      role: t.roleAdminDirector,
      email: 'almaz.b@tigrayedu.gov.et',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: currentLang === 'en' ? 'Goitom Redae' : 'ጐይትኦም ረዳኢ',
      role: t.roleExamDirector,
      email: 'goitom.r@tigrayedu.gov.et',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    }
  ];

  return (
    <section className="bg-white py-12 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Institutional History' : 'ወግዓዊ ታሪኽ'}</span>
        <h2 className="font-serif text-3xl md:text-4xl font-black text-primary-navy mt-1">
          {t.historyTitle}
        </h2>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
          <p>{t.historyText1}</p>
          <p>{t.historyText2}</p>
          
          <div className="p-4 bg-slate-50 border-l-4 border-tigray-red rounded-r space-y-2 mt-6">
            <h4 className="font-bold text-primary-navy uppercase font-serif text-xs tracking-wide flex items-center gap-1.5">
              <HeartHandshake size={14} className="text-tigray-red" />
              {currentLang === 'en' ? 'Commitment to Safe Spaces' : 'ውሕስነት ደቅና ንቕድሚት'}
            </h4>
            <p className="text-[11px] text-slate-500 text-left">
              {currentLang === 'en' 
                ? 'Every step of curriculum validation includes mental health protocols and resilient instruction models directly tailored for regional requirements.'
                : 'ነፍሲ ወከፍ ናይ ስርዓተ ትምህርቲ ፎርማት ንስነ-ኣእምሮኣዊ ምሕውያትን ፅኑዕ ተምሃሮ ምፍጣርን ዝኣመተ እዩ።'}
            </p>
          </div>
        </div>

        {/* Visual Pillars */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col text-center items-center">
            <Landmark size={32} className="text-primary-navy mb-3" />
            <span className="font-bold text-xs uppercase tracking-wider text-primary-navy block mb-1">
              Federal Authority
            </span>
            <span className="text-[10px] text-slate-500">
              Coordinated with Federal Ministry of Ethiopia
            </span>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col text-center items-center">
            <Users2 size={32} className="text-accent-amber mb-3" />
            <span className="font-bold text-xs uppercase tracking-wider text-primary-navy block mb-1">
              Active Districts
            </span>
            <span className="text-[10px] text-slate-500">
              Serving 90+ Woredas & major urban zones
            </span>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col text-center items-center">
            <ShieldCheck size={32} className="text-emerald-600 mb-3" />
            <span className="font-bold text-xs uppercase tracking-wider text-primary-navy block mb-1">
              Compliance standards
            </span>
            <span className="text-[10px] text-slate-500">
              Strict teacher background and security checks
            </span>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col text-center items-center">
            <Award size={32} className="text-tigray-red mb-3" />
            <span className="font-bold text-xs uppercase tracking-wider text-primary-navy block mb-1">
              Assessment Authority
            </span>
            <span className="text-[10px] text-slate-500">
              Official issuer of Grade 8 Certificates
            </span>
          </div>
        </div>
      </div>

      {/* Organizational Map & Org Structure */}
      <div>
        <h3 className="font-serif text-2xl font-black text-primary-navy mb-6 border-b border-slate-100 pb-3">
          {t.orgStructure}
        </h3>
        <p className="text-slate-600 text-xs md:text-sm max-w-2xl mb-8 font-medium">
          {currentLang === 'en' 
            ? 'The office layout operates under a Bureau Chief guiding three major directorates. Each branch reports directly to ensuring transparent accountability and public coordination.'
            : 'እዚ ቢሮ እዚ ብሓደ ሓላፊ ቢሮን ሰለስተ ሓለፍቲ ዳይሬክቶሬትን ዝምራሕ ኮይኑ ግልፅነትን ተሓታትነትን መሪሕነት ባእታታቱ እዩ።'}
        </p>

        {/* Dynamic Card Tree representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((lead, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col text-center items-center shadow-sm">
              <img 
                src={lead.img} 
                alt={lead.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-accent-amber mb-3 bg-slate-100 placeholder-face" 
              />
              <h5 className="font-bold text-sm text-primary-navy font-serif leading-tight">
                {lead.name}
              </h5>
              <span className="text-[10px] uppercase font-bold text-accent-amber tracking-wider block mt-1 leading-snug">
                {lead.role}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-3 hover:text-primary-navy hover:underline block truncate select-all w-full">
                {lead.email}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
