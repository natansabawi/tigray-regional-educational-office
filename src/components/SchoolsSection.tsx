import { useState } from 'react';
import { Search, MapPin, Building2, Users, FileSpreadsheet, Filter } from 'lucide-react';
import { Language, translations } from '../translations';
import { School, SchoolLevel, SchoolType } from '../types';

interface SchoolsSectionProps {
  currentLang: Language;
  schools: School[];
}

export default function SchoolsSection({ currentLang, schools }: SchoolsSectionProps) {
  const t = translations[currentLang];
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Distinct Zones
  const zones = ['All', ...Array.from(new Set(schools.map(s => currentLang === 'en' ? s.zone : s.zoneTg)))];
  const levels = ['All', 'Primary', 'Secondary', 'TVET', 'Higher'];
  const types = ['All', 'Public', 'Private'];

  // Filter criteria
  const filteredSchools = schools.filter(school => {
    const nameText = currentLang === 'en' ? school.name : school.nameTg;
    const matchesSearch = nameText.toLowerCase().includes(search.toLowerCase());
    
    const zoneText = currentLang === 'en' ? school.zone : school.zoneTg;
    const matchesZone = selectedZone === 'All' || zoneText === selectedZone;
    const matchesLevel = selectedLevel === 'All' || school.level === selectedLevel;
    const matchesType = selectedType === 'All' || school.type === selectedType;

    return matchesSearch && matchesZone && matchesLevel && matchesType;
  });

  return (
    <section className="bg-slate-50 py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[600px]">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Verified Directory' : 'ወግዓዊ መዝገብ'}</span>
        <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
          {t.schoolsTitle}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">{t.schoolsSub}</p>
      </div>

      {/* Advanced Filter Action Container */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
        {/* Search & Top Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchSchools}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-xs md:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-navy font-semibold"
            />
          </div>

          <div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs md:text-sm bg-slate-50 focus:outline-none font-semibold text-slate-700"
            >
              <option value="All">{currentLang === 'en' ? 'All Zones (ምድብ ዞባ)' : 'ኩል ዞባታት'}</option>
              {zones.filter(z => z !== 'All').map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs md:text-sm bg-slate-50 focus:outline-none font-semibold text-slate-700"
            >
              <option value="All">{currentLang === 'en' ? 'All Grade Levels' : 'ኩሎም ክፍሊታት'}</option>
              {levels.filter(l => l !== 'All').map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'en' ? 'Funding Type:' : 'ደገፍ ሓገዝ:'}
            </span>
            <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
              {types.map(tOption => (
                <button
                  key={tOption}
                  onClick={() => setSelectedType(tOption)}
                  className={`px-3 py-1 rounded-md font-semibold ${
                    selectedType === tOption 
                      ? 'bg-white text-primary-navy shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tOption === 'All' ? (currentLang === 'en' ? 'All' : 'ኩሉ') : tOption}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:ml-auto text-[11px] font-mono text-slate-400">
            {currentLang === 'en' ? 'Filtered Counter:' : 'ዝተረኸቡ ቁጽሪ:'} <span className="text-primary-navy font-bold">{filteredSchools.length} schools</span>
          </div>
        </div>
      </div>

      {/* Directory Spreadsheet Layout Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">{t.schoolName}</th>
                <th className="p-4">{t.schoolLevel}</th>
                <th className="p-4">{t.schoolType}</th>
                <th className="p-4">{t.schoolLocation}</th>
                <th className="p-4 text-right">{t.schoolStudents}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                    No schools registered matching state filters.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50 font-medium text-slate-700">
                    {/* Name */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <span className="block font-bold text-primary-navy">
                          {currentLang === 'en' ? school.name : school.nameTg}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ID: {school.id}
                        </span>
                      </div>
                    </td>

                    {/* Level Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        school.level === 'Primary' ? 'bg-indigo-100 text-indigo-700' :
                        school.level === 'Secondary' ? 'bg-primary-navy text-accent-amber' :
                        school.level === 'TVET' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {school.level}
                      </span>
                    </td>

                    {/* Type Block */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        school.type === 'Public' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {school.type}
                      </span>
                    </td>

                    {/* Zone & Woreda coordinates */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>
                          {currentLang === 'en' ? school.woreda : school.woredaTg}, {currentLang === 'en' ? school.zone : school.zoneTg}
                        </span>
                      </div>
                    </td>

                    {/* Enrollment count */}
                    <td className="p-4 text-right font-bold text-primary-navy font-mono">
                      {(school.studentCount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
