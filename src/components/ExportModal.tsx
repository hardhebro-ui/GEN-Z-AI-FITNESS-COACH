import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Share2, Download, CheckCircle2, Copy, Dumbbell, Smartphone } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';

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

  const handleShare = async () => {
    if (!userName.trim()) return;
    
    try {
      setIsGeneratingImage(true);
      if (shareCardRef.current) {
        const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, quality: 0.95 });
        
        // Convert dataUrl to blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'fitness-plan.png', { type: 'image/png' });
        
        const shareText = `I just generated my personalized AI Fitness & Diet plan! 💪\n\nGet yours for free in 60 seconds at: https://fitness-ai.app`;

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'My AI Fitness Plan',
              text: shareText,
            });
            setHasShared(true);
          } catch (err) {
            console.error('Share failed:', err);
          }
        } else {
          // Fallback: download image and open WhatsApp
          const link = document.createElement('a');
          link.download = 'my-fitness-plan.png';
          link.href = dataUrl;
          link.click();
          
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-50/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <h3 className="text-xl font-bold text-zinc-900">Unlock PDF Export</h3>
            <button onClick={onClose} className="p-2 text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('donate')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'donate' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-zinc-600 hover:text-zinc-800'}`}
            >
              Support Us
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'share' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-zinc-600 hover:text-zinc-800'}`}
            >
              Share to Unlock
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'donate' ? (
              <div className="space-y-6">
                {!showUpi ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-lg">Keep this tool free!</h4>
                      <p className="text-sm text-zinc-600">Your support helps us pay for AI costs and server hosting.</p>
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
                          className={`p-3 rounded-xl border text-center transition-all ${donationAmount === tier.amount ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'}`}
                        >
                          <div className="font-bold">₹{tier.amount}</div>
                          <div className="text-xs opacity-80 mt-1">{tier.label}</div>
                        </button>
                      ))}
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Custom Amount (₹)"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setDonationAmount(Number(e.target.value));
                        }}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    <button
                      onClick={handleDonate}
                      disabled={!donationAmount || donationAmount <= 0}
                      className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Pay ₹{donationAmount || 0} via UPI
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg">Pay ₹{donationAmount} via UPI</h4>
                      <p className="text-sm text-zinc-600">Scan QR or click below to pay</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 inline-block mx-auto">
                      <QRCode value={upiUrl} size={180} />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200 mx-auto max-w-[200px]">
                      <span className="font-mono truncate">{upiId}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(upiId)}
                        className="p-1 hover:text-emerald-600 transition-colors shrink-0"
                        title="Copy UPI ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={upiUrl}
                        className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
                      >
                        Open UPI App
                        <Smartphone className="w-4 h-4" />
                      </a>
                      
                      <button
                        onClick={handleVerifyPayment}
                        disabled={isVerifying}
                        className="w-full py-4 bg-zinc-100 text-zinc-900 font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isVerifying ? 'Verifying...' : 'I have completed the payment'}
                        {!isVerifying && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => setShowUpi(false)}
                        className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-lg">Share with friends</h4>
                  <p className="text-sm text-zinc-600">Generate a custom image, share it, and unlock your PDF instantly.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">Your Name (for the image)</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Hidden Share Card for html-to-image */}
                <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
                  <div ref={shareCardRef} className="w-[1080px] h-[1080px] bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center p-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-zinc-100/80" />
                    <div className="z-10 text-center space-y-12">
                      <div className="w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-600/50">
                        <Dumbbell className="w-16 h-16 text-white" />
                      </div>
                      <h1 className="text-7xl font-bold tracking-tight leading-tight">
                        Generate Workout &<br />Diet in <span className="text-emerald-600">60 Seconds</span>
                      </h1>
                      <div className="inline-block px-8 py-4 bg-white border-2 border-zinc-200 rounded-full mt-8">
                        <p className="text-3xl font-medium text-zinc-700">
                          Recommended by <span className="text-emerald-600 font-bold">{userName || 'a friend'}</span>
                        </p>
                      </div>
                      <div className="mt-24">
                        <p className="text-2xl text-zinc-500 font-mono">fitness-ai.app</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleShare}
                    disabled={!userName.trim() || isGeneratingImage}
                    className="w-full py-4 bg-zinc-100 text-zinc-900 font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGeneratingImage ? 'Generating Image...' : '1. Download Share Image'}
                    <Download className="w-4 h-4" />
                  </button>

                  <label className="flex items-start gap-3 p-4 border border-zinc-200 rounded-xl cursor-pointer hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasShared}
                      onChange={(e) => setHasShared(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 bg-zinc-50"
                    />
                    <span className="text-sm text-zinc-700">
                      I have shared this image with at least one person on WhatsApp, Instagram, or X.
                    </span>
                  </label>

                  <button
                    onClick={onUnlock}
                    disabled={!hasShared}
                    className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    2. Unlock My PDF
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
