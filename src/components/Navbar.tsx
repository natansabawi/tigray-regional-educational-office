import { useState, useEffect } from 'react';
import { 
  Menu, X, Globe, LogOut, User as UserIcon, ShieldAlert 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { User } from '../types';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({
  currentLang,
  setLang,
  activeTab,
  setActiveTab,
  user,
  onLogout
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = translations[currentLang];

  const menuItems = [
    { key: 'home', label: t.navHome },
    { key: 'about', label: t.navAbout },
    { key: 'news', label: t.navNews },
    { key: 'schools', label: t.navSchools },
    { key: 'programs', label: t.navPrograms },
    { key: 'exams', label: t.navExams },
    { key: 'docs', label: t.navDocs },
    { key: 'contact', label: t.navContact },
  ];

  return (
    <header className="h-20 bg-primary-navy text-white flex items-center justify-between px-4 md:px-8 border-b-4 border-accent-amber shrink-0 sticky top-0 z-50 shadow-md">
      {/* Brand Logo & Emblem Section */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
        {/* Simplified Tigray Emblem Silhouette */}
        <div className="w-11 h-11 bg-accent-amber rounded-full flex items-center justify-center relative shadow-sm shrink-0 border border-white/20">
          <div className="w-8 h-8 bg-tigray-red rounded-full flex items-center justify-center font-black text-[10px] text-white">
            ★
          </div>
          {/* Ge'ez style crown overlay */}
          <div className="absolute -top-1 font-serif text-[10px] text-accent-amber font-bold">
            ▲
          </div>
        </div>
        <div>
          <h1 className="font-serif text-base md:text-lg font-extrabold tracking-tight leading-tight">
            {currentLang === 'en' ? 'Tigray Regional Education Office' : 'ቢሮ ትምህርቲ ክልል ትግራይ'}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-accent-amber font-bold font-mono">
            {currentLang === 'en' ? 'Mekelle, Ethiopia' : 'መቐለ፥ ኢትዮጵያ'}
          </p>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <nav className="hidden lg:flex items-center gap-6">
        <ul className="flex gap-1.5 xl:gap-4 text-xs xl:text-sm font-semibold tracking-wide">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveTab(item.key)}
                className={`px-2.5 py-1.5 rounded transition duration-200 uppercase tracking-wider ${
                  activeTab === item.key
                    ? 'bg-white/15 text-accent-amber border-b-2 border-accent-amber'
                    : 'opacity-85 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-white/20 mx-1"></div>

        {/* Translation Switch & User Actions */}
        <div className="flex items-center gap-3">
          {/* Clean Language Pill */}
          <div className="flex bg-white/10 rounded-full p-0.5 text-[11px] items-center border border-white/15">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                currentLang === 'en'
                  ? 'bg-accent-amber text-primary-navy shadow-inner'
                  : 'text-white hover:text-accent-amber'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('tg')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                currentLang === 'tg'
                  ? 'bg-accent-amber text-primary-navy shadow-inner'
                  : 'text-white hover:text-accent-amber'
              }`}
            >
              ትግርኛ
            </button>
          </div>

          {/* Admin Portal Gateway */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase cursor-pointer border ${
                  activeTab === 'admin'
                    ? 'bg-[#1e3b5e] border-accent-amber text-accent-amber'
                    : 'bg-[#15304f] border-white/20 hover:bg-white/10 text-white'
                }`}
              >
                <UserIcon size={14} className="text-accent-amber" />
                <span className="max-w-[124px] truncate">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={onLogout}
                title="Log Out Bureau Session"
                className="p-1.5 bg-tigray-red/80 hover:bg-tigray-red rounded transition"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-accent-amber text-primary-navy px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-primary-navy transition duration-200 flex items-center gap-1"
            >
              <ShieldAlert size={12} />
              {t.navAdmin}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Burger Mechanism */}
      <div className="flex lg:hidden items-center gap-3">
        {/* Language Pill Mobile */}
        <div className="flex bg-white/10 rounded-full p-0.5 text-[10px] items-center border border-white/10">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-full font-bold ${
              currentLang === 'en' ? 'bg-accent-amber text-primary-navy' : 'text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('tg')}
            className={`px-2 py-0.5 rounded-full font-bold ${
              currentLang === 'tg' ? 'bg-accent-amber text-primary-navy' : 'text-white'
            }`}
          >
            ትግ
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:text-accent-amber transition"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-20 left-0 w-full bg-primary-navy border-b-4 border-accent-amber flex flex-col p-6 gap-4 z-50 lg:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <ul className="flex flex-col gap-3 font-semibold text-sm">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded transition uppercase tracking-wide text-xs ${
                    activeTab === item.key
                      ? 'bg-white/10 text-accent-amber'
                      : 'hover:bg-white/5 opacity-80'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="h-[1px] bg-white/15 my-1"></div>

          <div className="mt-2">
            {user ? (
              <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                <div className="flex items-center gap-2">
                  <UserIcon size={16} className="text-accent-amber" />
                  <span className="text-sm font-semibold truncate text-white">{user.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setMobileOpen(false);
                    }}
                    className="px-3 py-1 bg-accent-amber text-primary-navy text-xs font-bold rounded"
                  >
                    Console
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="p-1 px-2.5 bg-tigray-red rounded text-xs text-white"
                  >
                    {t.logout}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileOpen(false);
                }}
                className="w-full bg-accent-amber text-primary-navy p-3 rounded text-center text-xs font-bold uppercase tracking-wider"
              >
                {t.navAdmin}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
