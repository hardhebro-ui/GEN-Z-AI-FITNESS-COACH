import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

interface CookieConsentProps {
  onShowPolicy: () => void;
}

export default function CookieConsent({ onShowPolicy }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay to prevent flicker and feel more natural
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-neon/10 flex items-center justify-center shrink-0 border border-neon/20">
                <Cookie className="w-6 h-6 text-neon" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-black uppercase italic tracking-tight text-lg">Cookie Consent</h4>
                <p className="text-zinc-400 text-xs md:text-sm font-bold leading-relaxed max-w-xl">
                  We use cookies and local storage to improve your experience and remember your fitness plans. By continuing, you agree to our{' '}
                  <button 
                    onClick={onShowPolicy}
                    className="text-neon hover:underline underline-offset-4 decoration-2"
                  >
                    Cookie Policy
                  </button>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none px-6 py-4 rounded-xl bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all active:scale-95"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-neon text-black font-black uppercase italic tracking-widest text-[10px] shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all active:scale-95"
              >
                Accept All
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="hidden md:flex p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
