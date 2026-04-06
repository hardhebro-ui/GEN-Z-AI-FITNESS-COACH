import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, IndianRupee, ArrowRight, Activity, Zap } from 'lucide-react';
import SEO from '../components/SEO';

const SupportPage: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const upiId = "sarjil1432-1@okhdfcbank"; 
  const payeeName = "Fitin60ai.in";

  const finalAmount = donationAmount || (customAmount ? parseFloat(customAmount) : 0);
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4">
      <SEO 
        title="Support the Mission | Fitin60ai.in Donation"
        description="Help us keep our AI fitness servers running. Support the development of free, scientifically-backed workout and diet plans for everyone."
        canonical="https://fitin60ai.in/support"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
          >
            <Coffee className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Support Us</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 font-display leading-none">
            Support the <span className="text-neon">Mission</span>
          </h1>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-xl md:text-2xl">
            If this AI coach helped you, consider supporting its development and keeping the servers running.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="p-10 bg-zinc-900/30 border border-white/5 rounded-[3rem] space-y-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Why Support?</h2>
              <ul className="space-y-6">
                {[
                  "Keep AI generation free for everyone",
                  "Fund new features like AI form analysis",
                  "Support server costs and maintenance",
                  "Help us expand our fitness knowledge base"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-400 font-bold text-lg">
                    <div className="w-6 h-6 rounded-full bg-neon/10 flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-neon" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-4 p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5">
              <div className="w-12 h-12 bg-neon rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white font-black uppercase italic tracking-tight">Fitin60ai.in</p>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Empowering Athletes Worldwide</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-8">
              <div className="p-5 bg-neon/10 rounded-2xl">
                <Coffee className="w-10 h-10 text-neon" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[21, 51, 101].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setDonationAmount(amt);
                    setCustomAmount('');
                    setShowQR(true);
                  }}
                  className={`py-5 rounded-2xl border transition-all font-black text-xl font-display italic ${
                    donationAmount === amt 
                      ? 'bg-neon border-neon text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' 
                      : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-neon/50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative mb-10">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">
                <IndianRupee className="w-6 h-6" />
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setDonationAmount(null);
                  if (e.target.value) setShowQR(true);
                }}
                className="w-full bg-zinc-800/30 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-xl placeholder:text-zinc-700 focus:outline-none focus:border-neon transition-all font-bold"
              />
            </div>

            {showQR && (finalAmount > 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 p-8 bg-white rounded-[2rem] mb-10"
              >
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-56 h-56"
                  referrerPolicy="no-referrer"
                />
                <p className="text-black text-base font-black uppercase tracking-widest font-display italic">Scan to pay ₹{finalAmount}</p>
              </motion.div>
            )}

            <a 
              href={upiLink}
              className="w-full flex items-center justify-center gap-3 py-6 bg-neon text-black font-black text-2xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(204,255,0,0.2)] font-display uppercase italic"
            >
              Support Now
              <ArrowRight className="w-6 h-6" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
