import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, AlertTriangle, Scale, Activity, Zap, Info, Stethoscope, HeartPulse } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
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
              Terms & <span className="text-neon">Conditions</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Updated: March 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-white/10">
              <Scale className="w-8 h-8 text-neon" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar/Quick Info */}
          <div className="space-y-8">
            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-neon font-black uppercase tracking-widest text-xs">Quick Summary</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Zap className="w-4 h-4 text-neon shrink-0" />
                  AI-generated plans are for guidance only.
                </li>
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Stethoscope className="w-4 h-4 text-neon shrink-0" />
                  Not a substitute for medical advice.
                </li>
                <li className="flex gap-3 text-xs font-bold text-zinc-400">
                  <Shield className="w-4 h-4 text-neon shrink-0" />
                  You assume all risks of injury.
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-widest text-xs text-red-500">Critical Safety</h3>
              </div>
              <p className="text-[10px] leading-relaxed text-zinc-400 font-bold uppercase">
                Consult a doctor before starting any new workout or diet plan. Use at your own risk.
              </p>
            </div>
          </div>

          {/* Main Text */}
          <div className="md:col-span-2 space-y-12 pb-24">
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">01.</span> Introduction
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                fitin60.ai is an AI-powered fitness plan generator designed to provide educational workout and diet templates. By using this service, you agree to these terms in full.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" /> Medical Disclaimer
              </h2>
              <div className="p-8 bg-red-500/5 rounded-3xl border border-red-500/10 space-y-6">
                <p className="text-zinc-300 leading-relaxed font-bold text-lg italic">
                  "fitin60.ai does not provide medical advice. We are not a substitute for professional consultation with a doctor or certified trainer."
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4 text-zinc-400 font-medium">
                    <HeartPulse className="w-5 h-5 text-red-500 shrink-0" />
                    <span>Always consult a qualified healthcare professional before starting any new physical activity or changing your diet.</span>
                  </li>
                  <li className="flex gap-4 text-zinc-400 font-medium">
                    <Shield className="w-5 h-5 text-red-500 shrink-0" />
                    <span>You expressly agree that your use of the generated plans is at your sole risk. We are not responsible for any health problems or injuries.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">02.</span> AI-Generated Content
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                Our plans are created by Artificial Intelligence. While we strive for excellence, AI can produce inaccurate or unsuitable results. These plans are templates for guidance and should not be treated as definitive prescriptions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">03.</span> Limitation of Liability
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                fitin60.ai and its creators are not responsible or liable for any injuries, health complications, or diet-related issues (including allergies or intolerances) resulting from the use or misuse of our generated plans.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">04.</span> Cookies & Data
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                We use cookies and Local Storage to improve your experience and remember your plans. For more details on how we handle your information, please refer to our <strong>Privacy Policy</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">05.</span> Acceptable Use
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                You agree to use fitin60.ai for personal, non-commercial purposes only. You may not attempt to scrape our data or reverse-engineer our AI engine.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <span className="text-neon">06.</span> Service Changes
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium">
                We reserve the right to modify or discontinue the service at any time. We may also update these terms periodically to reflect changes in our service or legal requirements.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10">
              <div className="flex items-center gap-4 p-6 bg-zinc-900/30 rounded-3xl border border-white/5">
                <Info className="w-6 h-6 text-neon shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                  By using fitin60.ai, you confirm that you have read, understood, and agreed to these terms. Your safety is your responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
