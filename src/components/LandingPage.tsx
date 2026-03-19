import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Star, ArrowRight, Zap, Flame, FileText, Activity, Coffee, IndianRupee, QrCode, Users } from 'lucide-react';
import { Review } from '../types';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { db } from '../firebase';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });
  const [totalPlans, setTotalPlans] = useState<number>(0);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const upiId = "sarjil1432-1@okhdfcbank"; // Replace with actual UPI ID
  const payeeName = "AI Fitness Coach";

  const finalAmount = donationAmount || (customAmount ? parseFloat(customAmount) : 0);
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  useEffect(() => {
    // 1. Real-time reviews listener
    const reviewsRef = collection(db, 'reviews');
    // We use a query that handles missing createdAt by falling back to a simpler query if needed
    // but for now let's just ensure we show what we have.
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(15));
    
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews: Review[] = [];
      let totalRating = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          rating: data.rating,
          text: data.text || '',
          name: data.name || 'Anonymous',
          date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
        totalRating += data.rating;
      });

      setReviews(fetchedReviews);
      
      // Update stats from the fetched sample as a fallback
      if (fetchedReviews.length > 0) {
        setStats(prev => ({
          totalCount: Math.max(prev.totalCount, snapshot.size),
          averageRating: prev.totalCount > snapshot.size ? prev.averageRating : Number((totalRating / fetchedReviews.length).toFixed(1))
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews');
      // Fallback: try without ordering if the ordered query fails (e.g. missing index or missing fields)
      const fallbackQuery = query(reviewsRef, limit(15));
      onSnapshot(fallbackQuery, (snapshot) => {
        const fetchedReviews: Review[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReviews.push({
            id: doc.id,
            rating: data.rating,
            text: data.text || '',
            name: data.name || 'Anonymous',
            date: new Date().toISOString()
          });
        });
        setReviews(fetchedReviews);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'reviews-fallback');
      });
    });

    // 2. Real-time stats listener
    const statsRef = doc(db, "stats", "global");
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalPlans(data.totalPlans || 0);
        
        setStats(prev => ({
          totalCount: data.totalReviews || prev.totalCount,
          averageRating: data.averageRating ? Number(data.averageRating.toFixed(1)) : prev.averageRating
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/global');
    });

    return () => {
      unsubscribeReviews();
      unsubscribeStats();
    };
  }, []);

  const getInitials = (name: string) => {
    return (name || 'Anonymous').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950"></div>
        {/* Abstract neon glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8 md:py-20">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl text-center flex flex-col items-center justify-center min-h-[80vh] md:min-h-0"
        >
          {/* Floating Icon */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 md:p-5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Activity className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-8xl font-extrabold tracking-tight leading-tight mb-4">
            Your AI Fitness <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Coach
            </span>
          </h1>
          
          <p className="text-base md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8 px-2">
            Personalized workout & diet plans tailored to your body in 60 seconds — no login required.
          </p>

          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
              60 Sec Plan
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
              AI Powered
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 text-xs md:text-sm font-medium text-zinc-300">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
              {totalPlans > 0 ? `${totalPlans}+ Plans Generated` : 'Join the Community'}
            </div>
          </div>

          {/* CTA Button - Sticky on mobile bottom, normal on desktop */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-50 md:relative md:bg-none md:p-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 md:px-10 md:py-5 text-lg md:text-xl font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl md:rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] md:hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] min-h-[56px]"
            >
              Generate My Plan Now
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        {(stats.totalCount > 0 || reviews.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-6xl mt-24 md:mt-40 pb-48 md:pb-24 px-4"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-6xl font-extrabold mb-6 tracking-tight">Community Feedback</h2>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 md:w-8 md:h-8 ${i < Math.round(stats.averageRating) ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-6xl font-black text-white">{stats.averageRating}</span>
                    <span className="text-lg md:text-xl text-zinc-500 font-medium">/ 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats after the header div */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 md:mb-24">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              >
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-white leading-none">{totalPlans}+</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Plans Generated</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-6 py-3 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
              >
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-white leading-none">{stats.totalCount}</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex overflow-x-auto pb-12 pt-2 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar gap-6 md:gap-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  className="snap-center shrink-0 w-[300px] md:w-[450px] p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-zinc-900/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-1 mb-6 md:mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 md:w-6 md:h-6 ${i < review.rating ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-800'}`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-8 flex-grow text-lg md:text-xl leading-relaxed italic font-medium">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-zinc-950 font-black text-lg md:text-xl shadow-lg group-hover:scale-110 transition-transform">
                      {getInitials(review.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-base md:text-lg truncate">{review.name || 'Anonymous'}</p>
                      <p className="text-xs md:text-sm text-zinc-500 font-semibold uppercase tracking-widest">Community Member</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Individual Ratings List - Only good reviews with valid names */}
            <div className="mt-20 md:mt-32 space-y-8 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-10 text-zinc-400 uppercase tracking-widest">Recent Success Stories</h3>
              <div className="grid gap-6">
                {reviews
                  .filter(r => r.rating >= 4 && r.name && r.name.toLowerCase() !== 'anonymous')
                  .slice(0, 6)
                  .map((review) => (
                    <motion.div 
                      key={`list-${review.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex shrink-0 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-800'}`}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-zinc-300 text-sm md:text-base mb-2 font-medium leading-relaxed">
                          {review.text}
                        </p>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                          — {review.name}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
          </motion.div>
        )}

        {/* Footer / Donation Section */}
        <footer className="w-full max-w-6xl mt-20 pb-32 md:pb-12 border-t border-white/5 pt-12 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Coffee className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Support the Project</h3>
            <p className="text-zinc-400 text-sm mb-6">If this AI coach helped you, consider supporting its development!</p>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[21, 51, 101].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setDonationAmount(amt);
                    setCustomAmount('');
                    setShowQR(true);
                  }}
                  className={`py-2 rounded-xl border transition-all font-bold ${
                    donationAmount === amt 
                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950' 
                      : 'bg-zinc-800/50 border-white/5 text-zinc-300 hover:border-emerald-500/50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <IndianRupee className="w-4 h-4" />
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
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {showQR && (finalAmount > 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 p-4 bg-white rounded-2xl mb-6"
              >
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-40 h-40"
                  referrerPolicy="no-referrer"
                />
                <p className="text-zinc-950 text-xs font-bold uppercase tracking-wider">Scan to pay ₹{finalAmount}</p>
              </motion.div>
            )}

            <a 
              href={upiLink}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-zinc-950 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/20"
            >
              <QrCode className="w-5 h-5" />
              Pay via UPI App
            </a>
            <p className="text-[10px] text-zinc-600 mt-4 uppercase tracking-widest font-bold">Secure UPI Payment</p>
          </motion.div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-600 text-xs">
              © 2026 AI Fitness Coach. Built with precision & AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
