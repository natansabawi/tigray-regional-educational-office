import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import NewsSection from './components/NewsSection';
import SchoolsSection from './components/SchoolsSection';
import ProgramsSection from './components/ProgramsSection';
import ExamsSection from './components/ExamsSection';
import DocsSection from './components/DocsSection';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';

import { Language, translations } from './translations';
import { User, NewsItem, School, DocumentItem, SystemStats } from './types';
import { api } from './api';

export default function App() {
  // Page Tab state
  const [activeTab, setActiveTab] = useState<string>('home');
  // Localization state
  const [lang, setLang] = useState<Language>('en');
  // Authenticaton state
  const [user, setUser] = useState<User | null>(null);

  // Global registries state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Focus detail news overlays
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Initial automatic login check and data loaders
  useEffect(() => {
    // 1. Session re-evaluation
    const cachedToken = localStorage.getItem('treo_token');
    const cachedUser = localStorage.getItem('treo_user');
    if (cachedToken && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        // Clear broken token
        localStorage.removeItem('treo_token');
        localStorage.removeItem('treo_user');
      }
    }

    // 2. Load all entities
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Parallel REST execution for instant load metrics
      const [statsRes, newsRes, schoolsRes, docsRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getNews().catch(() => []),
        api.getSchools().catch(() => []),
        api.getDocuments().catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      if (newsRes && newsRes.length > 0) setNews(newsRes);
      if (schoolsRes && schoolsRes.length > 0) setSchools(schoolsRes);
      if (docsRes && docsRes.length > 0) setDocuments(docsRes);

    } catch (error) {
      console.warn('API sync warnings. Loading default regional caches.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('treo_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('treo_token');
    localStorage.removeItem('treo_user');
    setActiveTab('home');
  };

  const handleSelectNewsFromBanner = (item: NewsItem) => {
    setSelectedNews(item);
    setActiveTab('news');
  };

  // Scroll back to top on page switches to support smooth navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-accent-amber selection:text-primary-navy">
      {/* Dynamic Ge'ez Habesha National Accent Bar */}
      <div className="habesha-border shrink-0"></div>

      {/* Main Unified Header */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Primary Application Stages */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <Hero
            currentLang={lang}
            stats={stats}
            news={news}
            setActiveTab={setActiveTab}
            onSelectNews={handleSelectNewsFromBanner}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection currentLang={lang} />
        )}

        {activeTab === 'news' && (
          <NewsSection
            currentLang={lang}
            news={news}
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
          />
        )}

        {activeTab === 'schools' && (
          <SchoolsSection
            currentLang={lang}
            schools={schools}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsSection currentLang={lang} />
        )}

        {activeTab === 'exams' && (
          <ExamsSection currentLang={lang} />
        )}

        {activeTab === 'docs' && (
          <DocsSection
            currentLang={lang}
            documents={documents}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection currentLang={lang} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentLang={lang}
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            schools={schools}
            news={news}
            documents={documents}
            stats={stats}
            refreshAllData={fetchAllData}
          />
        )}
      </main>

      {/* Unified Institutional Footer */}
      <Footer
        currentLang={lang}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
