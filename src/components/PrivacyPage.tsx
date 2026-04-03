import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Eye, Database, Share2, Lock, Info, Server, Cookie } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-neon selection:text-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-neon transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Back to App</span>
            </button>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Privacy <span className="text-neon">Policy</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Updated: March 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-white/10">
              <ShieldCheck className="w-8 h-8 text-neon" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar/Quick Info */}
          <div className="space-y-8">
            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-neon font-black uppercase tracking-widest text-xs">Privacy at a Glance</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Lock className="w-4 h-4 text-neon shrink-0" />
                  No login or account required.
                </li>
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Eye className="w-4 h-4 text-neon shrink-0" />
                  We don't sell your personal data.
                </li>
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Database className="w-4 h-4 text-neon shrink-0" />
                  Fitness data is stored locally on your device.
                </li>
              </ul>
            </div>
          </div>

          {/* Main Text */}
          <div className="md:col-span-2 space-y-12 pb-24">
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">01.</span> Data Collection
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                We collect the fitness information you provide (such as age, weight, height, gender, goals, and fitness level) solely to generate your personalized AI workout and diet plans. We also store anonymous reviews or ratings if you choose to submit them.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">02.</span> How We Use Your Data
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                Your inputs are processed by our AI engine to create your fitness protocol. We may also use anonymous, aggregated data to improve our AI models and overall service quality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">03.</span> Data Storage
              </h2>
              <div className="space-y-4">
                <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">LocalStorage</h4>
                  <p className="text-zinc-400 text-sm font-medium">
                    Your fitness inputs and generated plans are stored in your browser's <strong>LocalStorage</strong>. This data stays on your device and is not sent to our permanent database.
                  </p>
                </div>
                <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Firebase</h4>
                  <p className="text-zinc-400 text-sm font-medium">
                    Anonymous reviews and ratings are stored in our <strong>Firebase</strong> database. This data is not linked to your personal identity.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <Cookie className="w-6 h-6 text-neon" /> Cookies & Local Storage
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                fitin60.ai uses cookies and Local Storage strictly to enhance your experience. These technologies allow us to remember your preferences and your generated plans so you don't have to re-enter details on every visit.
              </p>
              <ul className="space-y-3 pl-4">
                <li className="flex items-start gap-3 text-sm text-zinc-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon mt-1.5 shrink-0" />
                  No personal identity tracking or advertising cookies.
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon mt-1.5 shrink-0" />
                  Consent-based usage via our first-visit banner.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">04.</span> Third-Party Services
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                We use <strong>Google Gemini AI</strong> to process your inputs and <strong>Firebase</strong> for hosting and anonymous data storage. These services have their own security protocols and privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">05.</span> Data Security
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                We take reasonable efforts to protect your information. However, no method of electronic storage or transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">06.</span> Your Rights
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                You have full control over your data. You can stop using the service at any time and clear your browser's cache or Local Storage to remove all stored fitness information.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10">
              <div className="flex items-center gap-4 p-6 bg-zinc-900/30 rounded-3xl border border-white/5">
                <Info className="w-6 h-6 text-neon shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                  We are committed to transparency. Your fitness journey is private, and we intend to keep it that way. Engineered for your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
