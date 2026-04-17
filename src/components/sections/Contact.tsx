import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ContactSection: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: serverTimestamp(),
        status: 'new'
      });

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 font-display leading-none">
            GET IN <span className="text-neon">TOUCH</span>
          </h2>
          <p className="text-zinc-500 font-bold text-lg max-w-2xl mx-auto">
            Have questions or need support? Our team is here to help you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: <Mail className="w-6 h-6" />, title: "Email Us", detail: import.meta.env.VITE_CONTACT_EMAIL || "Hardhebro@gmail.com" },
              { icon: <MessageSquare className="w-6 h-6" />, title: "Live Chat", detail: `WhatsApp: ${import.meta.env.VITE_CONTACT_WHATSAPP || "+91 97121 69979"}`, link: `https://wa.me/${(import.meta.env.VITE_CONTACT_WHATSAPP || "919712169979").replace(/[^0-9]/g, '')}` },
              { icon: <MapPin className="w-6 h-6" />, title: "Location", detail: "Gujarat, India" }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] flex items-start gap-6">
                <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0 text-neon">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black uppercase italic tracking-tight text-lg mb-1">{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-neon text-sm font-bold hover:underline">{item.detail}</a>
                  ) : (
                    <p className="text-zinc-400 text-sm font-medium">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 bg-neon/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-neon" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tight">Message Sent!</h3>
                  <button onClick={() => setStatus('idle')} className="text-neon text-xs font-black uppercase tracking-widest hover:underline">Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input required name="name" placeholder="Full Name" className="bg-zinc-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-neon transition-all font-bold" />
                    <input required name="email" type="email" placeholder="Email" className="bg-zinc-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-neon transition-all font-bold" />
                  </div>
                  <input required name="subject" placeholder="Subject" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-neon transition-all font-bold" />
                  <textarea required name="message" rows={4} placeholder="Your Message" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-neon transition-all font-bold resize-none" />
                  
                  {status === 'error' && <p className="text-red-500 text-sm font-bold">{errorMessage}</p>}
                  
                  <button disabled={status === 'loading'} type="submit" className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-neon/10 disabled:opacity-50">
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send />}
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
