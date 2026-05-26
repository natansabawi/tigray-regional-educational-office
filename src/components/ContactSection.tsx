import React, { useState } from 'react';
import { 
  Building, Mail, Phone, MapPin, Send, HelpCircle, 
  Map, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { api } from '../api';

interface ContactSectionProps {
  currentLang: Language;
}

export default function ContactSection({ currentLang }: ContactSectionProps) {
  const t = translations[currentLang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError(currentLang === 'en' ? 'All inquiry fields are mandatory.' : 'በጃኹም ኩሉ መሳርሒታት የእትዉ።');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.submitInquiry({ name, email, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error executingRest API transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-12 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col gap-10 min-h-[600px]">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">{currentLang === 'en' ? 'Public Outreach' : 'ርክባት ቢሮ'}</span>
        <h2 className="font-serif text-3xl font-black text-primary-navy mt-1">
          {t.contactTitle}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">
          {t.contactSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact info channels */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-primary-navy border-b border-slate-100 pb-3 uppercase tracking-wide text-xs">
              {currentLang === 'en' ? 'Operational Address & Hotlines' : 'ወግዓዊ ኣድራሻታትን ስልክታትን'}
            </h3>

            {/* Address */}
            <div className="flex gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-primary-navy shrink-0 h-11 w-11 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <span className="block font-bold text-primary-navy text-xs uppercase tracking-wide mb-1">
                  {t.officeAddress}
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                  {t.officeAddressVal}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-primary-navy shrink-0 h-11 w-11 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <span className="block font-bold text-primary-navy text-xs uppercase tracking-wide mb-1">
                  {t.officePhone}
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-bold font-mono">
                  +251 34 440 2039 / +251 34 440 8820
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-primary-navy shrink-0 h-11 w-11 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <span className="block font-bold text-primary-navy text-xs uppercase tracking-wide mb-1">
                  {t.officeEmail}
                </span>
                <span className="text-xs md:text-sm text-slate-600 font-mono font-bold hover:text-accent-amber hover:underline select-all cursor-pointer">
                  info@tigrayedu.gov.et
                </span>
              </div>
            </div>
          </div>

          {/* Map Section Layout representing physical coordinates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-serif text-sm font-bold text-primary-navy flex items-center gap-1.5 uppercase">
              <Map size={16} />
              {t.mapTitle}
            </h4>

            {/* Highly customized clean map overlay representing Mekelle */}
            <div className="relative h-60 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex flex-col justify-end p-4">
              {/* GIS visual elements representation */}
              <div className="absolute inset-0 opacity-20 pointer-events-none habesha-pattern-bg"></div>
              <div className="absolute inset-x-0 top-1/2 h-8 bg-slate-300 opacity-30 transform -rotate-12"></div>
              <div className="absolute inset-y-0 left-1/3 w-8 bg-slate-300 opacity-30 transform rotate-12"></div>
              
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-tigray-red/40 animate-ping"></div>
                  <div className="w-5 h-5 rounded-full bg-tigray-red border-2 border-white flex items-center justify-center shadow-lg font-black text-white text-[8px]">
                    ★
                  </div>
                </div>
              </div>

              {/* Tag details */}
              <div className="bg-white/95 border border-slate-200 p-3 rounded-lg text-xs font-semibold relative z-10 shadow-sm leading-snug">
                <span className="block text-primary-navy font-bold">Mekelle HQ — Adi Haki Highway</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Adjacent to Mekelle Teacher College</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="font-serif text-lg font-black text-primary-navy mb-4 flex items-center gap-1.5">
            <Send size={16} className="text-accent-amber" />
            {currentLang === 'en' ? 'Submit Official Inquiry' : 'ድሌት ርክብ የእትዉ'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm font-semibold text-slate-700">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                {t.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Kiros"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                {t.emailAddress}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yours@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-mono font-bold"
              />
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                {t.subject}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Inquiry or Complaint"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                {t.message}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Detailed description of your inquiries or certificates validation..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary-navy font-semibold font-sans"
              />
            </div>

            {/* Dynamic Status elements */}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex gap-2 font-medium">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>{t.submitSuccess}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-2 font-medium">
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-navy text-accent-amber py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#123154] transition disabled:opacity-50"
            >
              {loading ? t.submittingMsg : t.submitMsg}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
