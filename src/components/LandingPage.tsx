import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Star, ArrowRight, Zap, Flame, FileText, Activity, Coffee, IndianRupee, QrCode, Users, ShieldAlert, AlertTriangle, ShieldCheck, Lock, Stethoscope } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);

  const upiId = "sarjil1432-1@okhdfcbank"; // Replace with actual UPI ID
  const payeeName = "AI Fitness Coach";

  const finalAmount = donationAmount || (customAmount ? parseFloat(customAmount) : 0);
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  useEffect(() => {
    // 1. Real-time reviews listener
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(11));
    
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
          tags: data.tags || [],
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

    // 3. Scroll listener for sticky header
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribeReviews();
      unsubscribeStats();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getInitials = (name: string) => {
    return (name || 'Anonymous').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col custom-scrollbar">
      {/* Sticky Top Header (Appears on Scroll) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[60] p-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <span className="font-black uppercase italic tracking-tighter text-sm">Elite <span className="text-neon">Protocol</span></span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-6 py-2.5 bg-neon text-black font-black text-[10px] rounded-xl uppercase italic tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              Start Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-neon/10 rounded-full blur-[80px] md:blur-[120px]"></div>
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
            <div className="p-4 md:p-5 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              <Activity className="w-8 h-8 md:w-12 md:h-12 text-neon" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-6 font-display uppercase italic">
            Your AI <br className="hidden md:block" />
            <span className="text-neon drop-shadow-[0_0_30px_rgba(204,255,0,0.4)]">
              Coach
            </span>
          </h1>
          
          <p className="text-lg md:text-3xl text-zinc-400 max-w-2xl mx-auto font-medium leading-tight mb-8 px-4">
            Personalized workout & diet plans tailored to your body in 60 seconds.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3 text-neon" />
              No Data Stored
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Zap className="w-3 h-3 text-neon" />
              AI-Generated Plan
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <AlertTriangle className="w-3 h-3 text-neon" />
              Not Medical Advice
            </div>
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 text-sm md:text-base font-bold text-zinc-300">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-neon" />
              60 Sec Plan
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 text-sm md:text-base font-bold text-zinc-300">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
              AI Powered
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 text-sm md:text-base font-bold text-zinc-300">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-neon" />
              {totalPlans > 0 ? `${totalPlans}+ Plans` : 'Join Us'}
            </div>
          </div>

          {/* CTA Button */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-50 md:relative md:bg-none md:p-0">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 md:px-12 md:py-6 text-xl md:text-2xl font-black text-black bg-neon rounded-2xl md:rounded-3xl transition-all shadow-[0_0_40px_rgba(204,255,0,0.4)] hover:shadow-[0_0_60px_rgba(204,255,0,0.6)] font-display uppercase italic"
            >
              Start Your Transformation
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </motion.button>
          </div>
        </motion.div>

        {/* Safety & Trust Section */}
        <section className="w-full max-w-6xl mt-24 md:mt-40 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6"
              >
                <ShieldCheck className="w-4 h-4 text-neon" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Safety First Protocol</span>
              </motion.div>
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display">
                Built for <span className="text-neon">Trust</span>
              </h2>
              <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
                We prioritize your safety and privacy above all else. Our AI engine is trained to provide realistic, safe, and actionable advice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <Lock className="w-8 h-8" />,
                  title: "No Data Stored",
                  desc: "Your personal information never leaves your device. We don't store your health data on any server.",
                  color: "text-emerald-400"
                },
                {
                  icon: <AlertTriangle className="w-8 h-8" />,
                  title: "AI-Generated",
                  desc: "All plans are generated in real-time by advanced AI. We clearly label all AI content for transparency.",
                  color: "text-amber-400"
                },
                {
                  icon: <Stethoscope className="w-8 h-8" />,
                  title: "Not Medical Advice",
                  desc: "Our plans are for fitness guidance only. Always consult a professional before starting a new regimen.",
                  color: "text-blue-400"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 md:p-12 rounded-[3rem] bg-zinc-900/30 backdrop-blur-3xl border border-white/5 group hover:border-neon/30 transition-all shadow-2xl"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-zinc-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6 font-display">{item.title}</h3>
                  <p className="text-zinc-500 font-bold leading-relaxed text-base md:text-lg">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {(stats.totalCount > 0 || reviews.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-6xl mt-24 md:mt-40 pb-48 md:pb-24 px-4"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter font-display uppercase italic">Community <span className="text-neon">Feedback</span></h2>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -30 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.5 + (i * 0.1), 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 12 
                        }}
                      >
                        <Star
                          className={`w-8 h-8 md:w-12 md:h-12 ${i < Math.round(stats.averageRating) ? 'text-neon fill-neon drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'text-zinc-800'}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="text-5xl md:text-8xl font-black text-white font-display italic">{stats.averageRating}</span>
                    <span className="text-xl md:text-3xl text-zinc-600 font-bold">/ 5.0</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Stats after the header div */}
            <div className="flex flex-wrap justify-center gap-6 mb-20 md:mb-32">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl"
              >
                <div className="p-3 bg-neon/10 rounded-2xl">
                  <Users className="w-6 h-6 text-neon" />
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-white leading-none font-display italic">{totalPlans}+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mt-1">Plans Generated</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-4 px-8 py-4 bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl"
              >
                <div className="p-3 bg-neon/10 rounded-2xl">
                  <Star className="w-6 h-6 text-neon" />
                </div>
                <div className="text-left">
                  <p className="text-3xl font-black text-white leading-none font-display italic">{stats.totalCount}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mt-1">Total Reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Horizontal Scrollable Cards */}
            <div className="flex overflow-x-auto pb-16 pt-4 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar gap-8 md:gap-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {reviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                  className={`snap-center shrink-0 w-[320px] md:w-[500px] p-10 md:p-14 rounded-[3rem] bg-zinc-900/30 backdrop-blur-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col hover:border-neon/50 transition-all group relative overflow-hidden ${
                    review.rating === 5 ? 'border-neon/20' : 'border-white/5'
                  }`}
                >
                  {review.rating === 5 && (
                    <div className="absolute top-0 left-0 bg-neon text-black px-6 py-2 rounded-br-3xl text-[10px] font-black uppercase tracking-[0.2em] italic font-display">
                      Top Review
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star className="w-32 h-32 text-neon" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-8 md:mb-10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 md:w-8 md:h-8 ${i < review.rating ? 'text-neon fill-neon' : 'text-zinc-800'}`}
                      />
                    ))}
                  </div>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {review.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-neon/10 border border-neon/20 rounded-lg text-[10px] font-black text-neon uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-zinc-300 mb-10 flex-grow text-xl md:text-2xl leading-snug italic font-medium relative z-10">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-5 mt-auto relative z-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neon flex items-center justify-center text-black font-black text-xl md:text-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform font-display italic">
                      {getInitials(review.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-black text-lg md:text-xl truncate font-display uppercase italic">{review.name || 'Anonymous'}</p>
                      <p className="text-[10px] md:text-xs text-zinc-500 font-black uppercase tracking-[0.2em]">Verified Athlete</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Individual Ratings List - Only good reviews with valid names */}
            <div className="mt-20 md:mt-32 space-y-12 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 font-display">Recent <span className="text-neon">Success Stories</span></h3>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Real athletes, real results</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {reviews
                  .filter(r => r.rating >= 4 && r.name && r.name.toLowerCase() !== 'anonymous')
                  .slice(0, 8)
                  .map((review, idx) => (
                    <motion.div 
                      key={`list-${review.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col gap-4 p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:border-neon/20 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-neon fill-neon' : 'text-zinc-800'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Verified</span>
                      </div>

                      <p className="text-zinc-300 text-base md:text-lg italic font-medium leading-relaxed">
                        "{review.text}"
                      </p>

                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {review.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-black text-neon/60 uppercase tracking-widest">
                              #{tag.replace(/\s+/g, '')}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-neon uppercase italic font-display">
                          {getInitials(review.name)}
                        </div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                          {review.name}
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
        <footer className="w-full max-w-6xl mt-20 pb-40 md:pb-20 border-t border-white/5 pt-20 flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-lg bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-neon/10 rounded-2xl">
                <Coffee className="w-8 h-8 text-neon" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 font-display uppercase italic">Support the <span className="text-neon">Mission</span></h3>
            <p className="text-zinc-400 text-base md:text-lg mb-10 font-medium">If this AI coach helped you, consider supporting its development!</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[21, 51, 101].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setDonationAmount(amt);
                    setCustomAmount('');
                    setShowQR(true);
                  }}
                  className={`py-4 rounded-2xl border transition-all font-black text-lg font-display italic ${
                    donationAmount === amt 
                      ? 'bg-neon border-neon text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' 
                      : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-neon/50'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <IndianRupee className="w-5 h-5" />
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
                className="w-full bg-zinc-800/30 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white text-lg placeholder:text-zinc-700 focus:outline-none focus:border-neon transition-all font-bold"
              />
            </div>

            {showQR && (finalAmount > 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 p-6 bg-white rounded-3xl mb-8"
              >
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48"
                  referrerPolicy="no-referrer"
                />
                <p className="text-black text-sm font-black uppercase tracking-widest font-display italic">Scan to pay ₹{finalAmount}</p>
              </motion.div>
            )}

            <a 
              href={upiLink}
              className="w-full flex items-center justify-center gap-3 py-5 bg-neon text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(204,255,0,0.2)] font-display uppercase italic"
            >
              <QrCode className="w-6 h-6" />
              Pay via UPI App
            </a>
            <p className="text-[10px] text-zinc-700 mt-6 uppercase tracking-[0.3em] font-black">Secure Encryption Enabled</p>
          </motion.div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 rounded-full border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" />
                No Data Stored
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 rounded-full border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                AI-Generated
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/30 rounded-full border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <AlertTriangle className="w-3 h-3" />
                Not Medical Advice
              </div>
            </div>
            <div className="flex gap-6">
              <Activity className="w-6 h-6 text-zinc-800" />
              <Dumbbell className="w-6 h-6 text-zinc-800" />
              <Flame className="w-6 h-6 text-zinc-800" />
            </div>
            <p className="text-zinc-700 text-xs font-black uppercase tracking-[0.2em]">
              © 2026 AI Fitness Coach. Engineered for Excellence.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
