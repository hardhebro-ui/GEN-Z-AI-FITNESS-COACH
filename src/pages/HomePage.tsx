import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, Zap, AlertTriangle, LayoutGrid, Star, Users, ChevronDown, ChevronUp, ShieldCheck, Lock, Stethoscope } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Review } from '../types';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalCount: 0, averageRating: 0 });
  const [totalPlans, setTotalPlans] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Real-time reviews listener
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(6));
    
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
      if (fetchedReviews.length > 0) {
        setStats(prev => ({
          totalCount: Math.max(prev.totalCount, snapshot.size),
          averageRating: Number((totalRating / fetchedReviews.length).toFixed(1))
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reviews-homepage');
    });

    // Real-time stats listener
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
    });

    return () => {
      unsubscribeReviews();
      unsubscribeStats();
    };
  }, []);

  const getInitials = (name: string | null) => {
    if (!name || name.trim() === '') return 'AN';
    return name.trim().substring(0, 2).toUpperCase();
  };

  const faqs = [
    {
      question: "How does the AI workout plan generator work?",
      answer: "Our AI analyzes your body metrics, fitness goals, available equipment, and experience level to craft a scientifically-backed workout split. It uses advanced algorithms to ensure progressive overload and balanced muscle development."
    },
    {
      question: "Is the diet plan really personalized?",
      answer: "Yes! The AI calculates your TDEE (Total Daily Energy Expenditure) and macros based on your specific inputs. It then generates a meal plan that fits your dietary preferences, budget, and fitness objectives."
    },
    {
      question: "Can I download my fitness plan as a PDF?",
      answer: "Absolutely. Once your plan is generated, you can view it instantly and download a high-quality PDF version to keep on your phone or print for the gym."
    },
    {
      question: "Is Fitin60ai.in free to use?",
      answer: "Generating and viewing your plan is completely free. We prioritize accessibility to help everyone start their fitness journey without financial barriers."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans flex flex-col">
      <SEO 
        title="Fitin60ai.in | AI Workout Plan Generator & Free Diet Plan PDF"
        description="Get your personalized fitness plan and free diet plan PDF in 60 seconds. AI-powered workout generator optimized for your body and goals."
        canonical="https://fitin60ai.in"
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle Mesh Gradient */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon/5 rounded-full blur-[120px]"></div>
          
          {/* Very Faint Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl text-center flex flex-col items-center justify-center relative z-10"
        >
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Your AI Fitness Coach</span>
          </motion.div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white max-w-4xl">
            Build Your Perfect Body Plan in <span className="text-neon relative inline-block">
              60 Seconds
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-neon/30 blur-sm rounded-full"></div>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12 px-4">
            AI-powered workout and diet plans tailored to your body, goals, and lifestyle. <span className="text-white">No signup. Instant PDF.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-16">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-lg font-black text-black bg-neon rounded-2xl transition-all shadow-[0_20px_40px_-15px_rgba(204,255,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(204,255,0,0.4)] uppercase italic tracking-wider"
            >
              Generate My Plan Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <Link 
              to="/explore-plans"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-lg font-black text-white bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-sm uppercase italic tracking-wider"
            >
              Explore Plans
              <LayoutGrid className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No Signup Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Instant PDF Export</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Beginner Friendly</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Short How It Works Preview */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display">
            How It <span className="text-neon">Works</span>
          </h2>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            Three simple steps to your elite fitness protocol. No complex signups, just results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Input Data", desc: "Enter your body metrics, goals, and available equipment in our smart form." },
            { step: "02", title: "AI Analysis", desc: "Our AI engine processes your profile to create a custom workout and diet split." },
            { step: "03", title: "Get Protocol", desc: "View your plan instantly and download your free diet plan PDF." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-neon/10 transition-colors">{item.step}</div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">{item.title}</h3>
                <p className="text-zinc-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/how-it-works" className="text-neon font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all">
            See Full Process <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4 bg-zinc-900/20 rounded-[4rem] border border-white/5 p-12 md:p-24 mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-display leading-none">
              Why Choose <span className="text-neon">AI Fitness</span> Plans?
            </h2>
            <p className="text-zinc-400 font-bold text-lg leading-relaxed">
              Traditional generic plans don't account for your unique biology. Our AI-driven approach ensures every set, rep, and calorie is optimized for your specific transformation.
            </p>
            <ul className="space-y-6">
              {[
                "Scientifically-backed workout splits",
                "Macro-balanced personalized diet plans",
                "Adaptive to your home or gym equipment",
                "Instant generation - no waiting for coaches",
                "Free PDF export for easy tracking"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-white font-black uppercase italic tracking-tight text-sm">
                  <div className="w-6 h-6 rounded-full bg-neon flex items-center justify-center shrink-0">
                    <Zap className="w-3 h-3 text-black" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-neon/20 blur-[100px] rounded-full" />
            <div className="relative bg-zinc-950 border border-white/10 rounded-[3rem] p-8 shadow-2xl rotate-3">
              <div className="space-y-6">
                <div className="h-4 w-2/3 bg-zinc-900 rounded-full" />
                <div className="h-4 w-full bg-zinc-900 rounded-full" />
                <div className="h-4 w-1/2 bg-neon/20 rounded-full" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-24 bg-zinc-900 rounded-2xl" />
                  <div className="h-24 bg-zinc-900 rounded-2xl" />
                </div>
                <div className="h-12 w-full bg-neon rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Knowledge Base Section */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 font-display">
            Fitness <span className="text-neon">Knowledge Base</span>
          </h2>
          <p className="text-zinc-500 font-bold max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            Master your transformation with our AI-curated fitness guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: "build-muscle-ai", title: "How to Build Muscle with AI", desc: "Learn how artificial intelligence is revolutionizing hypertrophy and strength training." },
            { id: "fat-loss-protocol", title: "The Ultimate Fat Loss Protocol", desc: "A deep dive into calorie deficits, macros, and metabolic optimization." },
            { id: "home-vs-gym", title: "Home vs Gym: Which is Better?", desc: "Comparing the effectiveness of bodyweight training versus heavy iron." },
            { id: "mastering-macros", title: "Mastering Your Macros", desc: "Everything you need to know about proteins, fats, and carbohydrates for your body type." },
            { id: "progressive-overload", title: "Progressive Overload 101", desc: "The fundamental principle of muscle growth explained for beginners." },
            { id: "supplements-guide", title: "Supplements That Actually Work", desc: "Cutting through the noise to find the scientifically-backed performance enhancers." }
          ].map((article, i) => (
            <Link 
              key={i} 
              to={`/blog`}
              className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-4 group-hover:text-neon transition-colors">{article.title}</h3>
              <p className="text-zinc-500 font-bold leading-relaxed text-sm">{article.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-neon text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Read Guide <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-4xl mx-auto py-24 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 font-display">
            Frequently Asked <span className="text-neon">Questions</span>
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-white/10">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left"
              >
                <span className="text-lg md:text-xl font-black uppercase italic tracking-tight text-white">{faq.question}</span>
                {openFaq === i ? <ChevronUp className="w-6 h-6 text-neon" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 md:px-8 pb-8"
                  >
                    <p className="text-zinc-400 font-bold leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="w-full max-w-6xl mx-auto py-24 px-4 relative overflow-hidden">
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
        <section className="w-full max-w-6xl mx-auto py-24 px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter font-display uppercase italic text-center">Community <span className="text-neon">Feedback</span></h2>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 md:w-12 md:h-12 ${i < Math.round(stats.averageRating) ? 'text-neon fill-neon drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'text-zinc-800'}`}
                    />
                  ))}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-8xl font-black text-white font-display italic">{stats.averageRating}</span>
                  <span className="text-xl md:text-3xl text-zinc-600 font-bold">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:border-neon/30 transition-all group flex flex-col"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-neon fill-neon' : 'text-zinc-800'}`}
                    />
                  ))}
                </div>
                
                <p className="text-zinc-300 mb-8 flex-grow text-lg italic font-medium leading-relaxed">
                  "{review.text || 'No written review provided'}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center text-black font-black text-lg font-display italic">
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm font-display uppercase italic">{review.name || 'Anonymous'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/reviews" className="text-neon font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all">
              View All Reviews <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
