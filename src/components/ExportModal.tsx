import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Share2, Download, CheckCircle2, Copy, Dumbbell, Smartphone, QrCode } from 'lucide-react';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function ExportModal({ isOpen, onClose, onUnlock }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'donate' | 'share'>('donate');
  const [donationAmount, setDonationAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [hasShared, setHasShared] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showUpi, setShowUpi] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const upiId = "sarjil1432-1@okhdfcbank"; // Replace with your actual UPI ID
  const upiName = "Fitness AI";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${donationAmount}&cu=INR`;

  const handleDonate = () => {
    setShowUpi(true);
  };

  const handleVerifyPayment = () => {
    setIsVerifying(true);
    // Simulate payment verification
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
    }, 2000);
  };

  const handleDownloadImage = async () => {
    if (!userName.trim()) return;
    try {
      setIsGeneratingImage(true);
      if (shareCardRef.current) {
        const dataUrl = await toPng(shareCardRef.current, { 
          cacheBust: true, 
          quality: 1,
          pixelRatio: 1,
          width: 1080,
          height: 1080
        });
        const link = document.createElement('a');
        link.download = `elite-protocol-${userName.toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
        setHasShared(true);
      }
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShare = async () => {
    if (!userName.trim()) return;
    
    try {
      setIsGeneratingImage(true);
      if (shareCardRef.current) {
        const dataUrl = await toPng(shareCardRef.current, { 
          cacheBust: true, 
          quality: 1,
          pixelRatio: 1,
          width: 1080,
          height: 1080
        });
        
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'elite-protocol.png', { type: 'image/png' });
        
        const shareText = `I just generated my personalized AI Fitness & Diet plan! 💪 Get yours for free in 60 seconds at: ${window.location.origin}`;

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Elite Protocol AI',
              text: shareText,
            });
            setHasShared(true);
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              console.error('Share failed:', err);
            }
          }
        } else {
          // Fallback: open WhatsApp
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          setHasShared(true);
        }
      }
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-zinc-950 border-t md:border border-white/10 rounded-t-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative"
        >
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Unlock <span className="text-neon">PDF</span></h3>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-all active:scale-90">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b border-white/5 shrink-0 bg-zinc-900/20">
            <button
              onClick={() => setActiveTab('donate')}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'donate' ? 'text-neon border-b-2 border-neon bg-neon/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Support Us
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'share' ? 'text-neon border-b-2 border-neon bg-neon/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Share to Unlock
            </button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {activeTab === 'donate' ? (
              <div className="space-y-8">
                {!showUpi ? (
                  <>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-neon/10 text-neon rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(204,255,0,0.1)]">
                        <Heart className="w-8 h-8" />
                      </div>
                      <h4 className="font-black text-2xl uppercase italic tracking-tight">Fuel the <span className="text-neon">AI</span></h4>
                      <p className="text-sm text-zinc-500 font-bold leading-relaxed">Your support keeps the servers running and the AI sharp. Help us keep this tool free for everyone.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { amount: 10, label: '☕ Chai' },
                        { amount: 20, label: '💻 Dev' },
                        { amount: 50, label: '🚀 Grow' }
                      ].map((tier) => (
                        <button
                          key={tier.amount}
                          onClick={() => {
                            setDonationAmount(tier.amount);
                            setCustomAmount('');
                          }}
                          className={`p-4 rounded-2xl border text-center transition-all ${donationAmount === tier.amount ? 'border-neon bg-neon/10 text-neon shadow-[0_0_20px_rgba(204,255,0,0.1)]' : 'border-white/5 hover:border-white/10 text-zinc-500 bg-zinc-900/40'}`}
                        >
                          <div className="font-black text-xl italic tracking-tighter">₹{tier.amount}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">{tier.label}</div>
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Custom Amount (₹)"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setDonationAmount(Number(e.target.value));
                        }}
                        className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-6 py-5 text-base text-white placeholder:text-zinc-600 focus:border-neon outline-none transition-all font-bold"
                      />
                    </div>

                    <button
                      onClick={handleDonate}
                      disabled={!donationAmount || donationAmount <= 0}
                      className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                    >
                      Pay ₹{donationAmount || 0} via UPI
                      <Smartphone className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-8 text-center">
                    <div className="space-y-2">
                      <h4 className="font-black text-2xl uppercase italic tracking-tight">Pay <span className="text-neon">₹{donationAmount}</span></h4>
                      <p className="text-sm text-zinc-500 font-bold">Scan QR or use the button below</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border-4 border-neon inline-block mx-auto shadow-[0_0_40px_rgba(204,255,0,0.2)]">
                      <QRCodeSVG value={upiUrl} size={200} />
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 bg-zinc-900/60 p-4 rounded-2xl border border-white/5 mx-auto w-full font-bold">
                      <span className="font-mono truncate">{upiId}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(upiId)}
                        className="p-2 hover:text-neon transition-colors shrink-0 bg-white/5 rounded-lg"
                        title="Copy UPI ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={upiUrl}
                        className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
                      >
                        Open UPI App
                        <Smartphone className="w-5 h-5" />
                      </a>
                      
                      <button
                        onClick={handleVerifyPayment}
                        disabled={isVerifying}
                        className="w-full py-5 bg-zinc-900 border border-white/5 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                      >
                        {isVerifying ? 'Verifying...' : 'I have completed the payment'}
                        {!isVerifying && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={() => setShowUpi(false)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors py-2"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <Share2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-2xl uppercase italic tracking-tight">Spread the <span className="text-blue-500">Gains</span></h4>
                  <p className="text-sm text-zinc-500 font-bold leading-relaxed">Generate your custom share card, post it, and unlock your PDF instantly.</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl px-6 py-5 text-base text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all font-bold"
                  />
                </div>

                {/* Hidden Share Card for html-to-image */}
                <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
                  <div ref={shareCardRef} className="w-[1080px] h-[1080px] bg-zinc-950 text-white flex flex-col items-center justify-between p-24 relative font-sans overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-zinc-950 to-zinc-950" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon/5 blur-[150px] rounded-full" />
                    
                    {/* Header */}
                    <div className="relative z-10 w-full flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-neon rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.3)] rotate-3">
                          <Dumbbell className="w-12 h-12 text-black" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Elite Protocol</h2>
                          <p className="text-neon font-bold text-lg uppercase tracking-[0.3em] mt-1">AI Fitness Engine</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Status: Optimized</p>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center space-y-12">
                      <div className="inline-block px-10 py-4 bg-neon/10 border border-neon/20 rounded-full backdrop-blur-xl">
                        <p className="text-neon font-black uppercase tracking-[0.4em] text-xl">Protocol Generated</p>
                      </div>
                      <h1 className="text-[140px] font-black tracking-tighter leading-[0.85] uppercase italic text-white">
                        I GOT MY<br />
                        <span className="text-neon">ELITE</span><br />
                        PLAN
                      </h1>
                      <div className="flex items-center justify-center gap-8 pt-8">
                        <div className="h-px w-24 bg-zinc-800" />
                        <p className="text-4xl font-black uppercase italic tracking-tight text-zinc-400">
                          Recommended by <span className="text-white">{userName || 'a friend'}</span>
                        </p>
                        <div className="h-px w-24 bg-zinc-800" />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 w-full flex items-end justify-between">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-sm">Get Yours Free At</p>
                          <p className="text-3xl font-black text-white">{window.location.origin.replace('https://', '')}</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="px-6 py-3 bg-zinc-900 rounded-xl border border-white/5 text-xs font-black uppercase tracking-widest text-zinc-400">#EliteProtocol</div>
                          <div className="px-6 py-3 bg-zinc-900 rounded-xl border border-white/5 text-xs font-black uppercase tracking-widest text-zinc-400">#AIFitness</div>
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <QRCodeSVG value={window.location.origin} size={140} level="H" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadImage}
                    disabled={!userName.trim() || isGeneratingImage}
                    className="py-5 bg-zinc-900 border border-white/5 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isGeneratingImage ? '...' : <Download className="w-5 h-5" />}
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={!userName.trim() || isGeneratingImage}
                    className="py-5 bg-blue-600 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                  >
                    {isGeneratingImage ? '...' : <Share2 className="w-5 h-5" />}
                    Share
                  </button>
                </div>

                  <label className="flex items-start gap-4 p-5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/5 transition-all bg-zinc-900/40 backdrop-blur-sm">
                    <input
                      type="checkbox"
                      checked={hasShared}
                      onChange={(e) => setHasShared(e.target.checked)}
                      className="mt-1 w-6 h-6 rounded border-white/10 text-neon focus:ring-neon bg-zinc-950 shrink-0"
                    />
                    <span className="text-xs text-zinc-400 font-bold leading-relaxed">
                      I have shared this card on WhatsApp, Instagram, or X to help my friends get fit.
                    </span>
                  </label>

                  <button
                    onClick={onUnlock}
                    disabled={!hasShared}
                    className="w-full py-5 bg-neon text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                  >
                    2. Unlock My PDF
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
