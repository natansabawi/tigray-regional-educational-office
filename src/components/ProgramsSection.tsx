import { HeartHandshake, Award, BookOpen, Settings2, Sparkles, AlertCircle } from 'lucide-react';
import { Language, translations } from '../translations';

interface ProgramsSectionProps {
  currentLang: Language;
}

export default function ProgramsSection({ currentLang }: ProgramsSectionProps) {
  const t = translations[currentLang];

  const blocks = [
    {
      icon: <HeartHandshake size={32} className="text-[#0d233a]" />,
      title: t.progSpecEd,
      desc: t.progSpecEdDesc,
      highlights: currentLang === 'en' 
        ? ['Trauma-responsive curriculum guides', 'Wheelchair accessibility projects', 'Braille textbook allocations']
        : ['ስነ-ኣእምሮኣዊ ምምሕያሽ ስርዓት', 'ምችውነት ክፍልታት ንስንክላን', 'ናይ ብሬይል መፃሕፍቲ ምቕራብ'],
      color: 'border-[#1d6042]'
    },
    {
      icon: <Award size={32} className="text-accent-amber" />,
      title: t.progTeacherTrain,
      desc: t.progTeacherTrainDesc,
      highlights: currentLang === 'en'
        ? ['Monthly pedagogy bootcamps', 'Coping-mechanism webinars', 'Interactive English instructors']
        : ['ወርሓዊ ናይ ኣስተምህሮ ስልጠናታት', 'ስነ-ኣእምሮኣዊ ድጋፍ መድርኽ', 'እዋናዊ ናይ እንግሊዘኛ ቋንቋ ስልጠና'],
      color: 'border-accent-amber'
    },
    {
      icon: <Settings2 size={32} className="text-tigray-red" />,
      title: t.progTVET,
      desc: t.progTVETDesc,
      highlights: currentLang === 'en'
        ? ['Practical electrical labs', 'Modern farming and crop workshops', 'Database engineering entryways']
        : ['ናይ ኤሌክትሪሲቲ ክፍልታት', 'ዘበናዊ ሕርሻን ምህርትን ዓውደ-ኣዋርሕ', 'ናይ ኮምፒውተር ሞያ መርሃ-ግብሪ'],
      color: 'border-tigray-red'
    },
    {
      icon: <BookOpen size={32} className="text-[#102a43]" />,
      title: t.progCurriculum,
      desc: t.progCurriculumDesc,
      highlights: currentLang === 'en'
        ? ['Re-establishing standard textbooks', 'Implementing local history models', 'STEM lab kits deployments']
        : ['መሰረታዊ መፃሕፍቲ ምዝርጋሕ', 'ናይ ከባብያዊ ታሪኽ ሞዴላት', 'ናይ ሳይንስን ላብን ናውቲ ምቕራብ'],
      color: 'border-[#102a43]'
    }
  ];

  return (
    <section className="bg-white py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Core Curricula & TVET' : 'መርሃ-ግብርታትን ስልጠናታትን'}</span>
        <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
          {currentLang === 'en' ? 'Strategic Development Programs' : 'ስትራቴጂካዊ ፕሮግራማት ልምዓት'}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          {currentLang === 'en' 
            ? 'Official, coordinated efforts to rebuild academic resilience and vocational skills.'
            : 'ወግዓውያን ናይ ትምህርቲ ፅሬትን ናይ ሞያ ተበፃሕነትን ንምምላእ ዝሳለጡ ዘለዉ ስራሕቲ።'}
        </p>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blocks.map((block, idx) => (
          <div 
            key={idx}
            className={`bg-slate-50 border-t-4 ${block.color} p-6 md:p-8 rounded-2xl flex flex-col justify-between transition hover:shadow-md border border-slate-100 shadow-sm`}
          >
            <div>
              <div className="mb-4 bg-white w-14 h-14 rounded-xl flex items-center justify-center border border-slate-200 shadow-inner">
                {block.icon}
              </div>

              <h3 className="font-serif text-xl font-bold text-primary-navy mb-3">
                {block.title}
              </h3>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                {block.desc}
              </p>
            </div>

            <div>
              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                {currentLang === 'en' ? 'Strategic Targets' : 'ቀንዲ ሸቶታት'}
              </h5>
              <ul className="space-y-1.5">
                {block.highlights.map((hl, hlIdx) => (
                  <li key={hlIdx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <span className="text-accent-amber text-sm shrink-0">✔</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Info box matching Clean Minimal visual */}
      <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-xs md:text-sm leading-relaxed border border-amber-200 mt-4 flex gap-3">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <div>
          <span className="font-bold underline">Institutional Directive:</span> {currentLang === 'en' 
            ? 'All local regional officers and partner international non-governmental organizations must align their vocational stipends under the parameters verified above.' 
            : 'ኩሎም ናይ ውሽጢ ዓድን ወፃእን መሻርኽቲ ውድባት ንዘውፅኡዎ ዓመታዊ ናይ ስልጠና ባጀት ምስቶም ኣብ ላዕሊ ተቐሚጦም ዘለዉ ሸቶታት ከወሃህዱዎ ይግበኦም።'}
        </div>
      </div>
    </section>
  );
}
