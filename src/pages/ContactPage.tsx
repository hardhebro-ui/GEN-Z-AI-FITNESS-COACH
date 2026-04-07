import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Contact Us | Fitin60ai.in</title>
        <meta name="description" content="Get in touch with the Fitin60ai.in team for support, partnerships, or general inquiries." />
      </Helmet>

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
              <p className="text-zinc-400 text-sm">support@fitin60.ai</p>
              <p className="text-zinc-400 text-sm">hello@fitin60.ai</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex items-start gap-6">
            <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-tight text-lg mb-2">Live Chat</h3>
              <p className="text-zinc-400 text-sm">Available 24/7 for premium members</p>
              <p className="text-zinc-400 text-sm">Average response: 5 mins</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex items-start gap-6">
            <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h3 className="font-black uppercase italic tracking-tight text-lg mb-2">Location</h3>
              <p className="text-zinc-400 text-sm">AI Innovation Hub</p>
              <p className="text-zinc-400 text-sm">Silicon Valley, CA</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Subject</label>
              <input 
                type="text" 
                placeholder="What can we help you with?"
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Message</label>
              <textarea 
                rows={6}
                placeholder="Tell us more about your inquiry..."
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white focus:border-neon outline-none transition-colors resize-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(204,255,0,0.2)]"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
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
