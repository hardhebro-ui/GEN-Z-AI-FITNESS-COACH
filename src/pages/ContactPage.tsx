import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactPage: React.FC = () => {
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
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <SEO 
        title="Contact Us | Get in Touch with Fitin60ai.in Support"
        description="Have questions about your AI fitness plan? Contact the Fitin60ai.in team for support, feedback, or business inquiries."
        canonical="https://fitin60ai.in/contact-us"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
          GET IN <span className="text-neon">TOUCH</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-3xl mx-auto font-medium">
          Have questions or need support? Our team is here to help you on your fitness journey.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12 mb-32">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex items-start gap-6">
            <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-tight text-lg mb-2">Email Us</h3>
              <p className="text-zinc-400 text-sm">Hardhebro@gmail.com</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex items-start gap-6">
            <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-tight text-lg mb-2">Live Chat</h3>
              <a 
                href="https://wa.me/919712169979" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neon text-sm font-bold hover:underline"
              >
                Chat on WhatsApp
              </a>
              <p className="text-zinc-400 text-[10px] mt-1 uppercase tracking-widest">+91 97121 69979</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex items-start gap-6">
            <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-tight text-lg mb-2">Location</h3>
              <p className="text-zinc-400 text-sm">106, Navafaliya, Vansda</p>
              <p className="text-zinc-400 text-sm">396580 Gujarat, India</p>
            </div>
          </div>
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
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase italic tracking-tight">Message Sent!</h3>
                  <p className="text-zinc-400 font-medium">Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Subject</label>
                  <input 
                    required
                    name="subject"
                    type="text" 
                    placeholder="What can we help you with?"
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Message</label>
                  <textarea 
                    required
                    name="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button 
                  disabled={status === 'loading'}
                  type="submit"
                  className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-zinc-900/30 border border-white/5 p-8 md:p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-4">Medical Disclaimer</h2>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Fitin60ai.in provides AI-generated fitness and nutrition guidance for informational purposes only. Our plans are not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare professional before starting any new exercise or diet program. Use of our services is at your own risk.
          </p>
          <Link to="/disclaimer" className="inline-block mt-6 text-neon text-[10px] font-black uppercase tracking-widest hover:underline">
            Read Full Disclaimer
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
