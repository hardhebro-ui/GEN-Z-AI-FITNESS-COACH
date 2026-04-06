import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Star, 
  Download, 
  Eye, 
  Loader2, 
  Flame,
  LayoutGrid,
  List,
  Activity,
  Zap,
  Target,
  Dumbbell,
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ExplorePlan, UserInputs } from '../types';
import { 
  fetchExplorePlans, 
  fetchTrendingPlans, 
  incrementDownloadCount,
  fetchPlanDetails
} from '../services/exploreService';
import { generateProgrammaticPDF } from '../services/pdfService';
import PlanPreviewModal from './PlanPreviewModal';
import SEO from './SEO';

interface ExplorePlansProps {
  onBack: () => void;
  lastInputs?: UserInputs | null;
}

const ExplorePlans: React.FC<ExplorePlansProps> = ({ onBack, lastInputs }) => {
  const PLANS_PER_PAGE = 24;
  const [plans, setPlans] = useState<ExplorePlan[]>([]);
  const [trendingPlans, setTrendingPlans] = useState<ExplorePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy] = useState<'downloads' | 'createdAt' | 'rating'>('createdAt');
  const [filters, setFilters] = useState({
    goal: '',
    level: '',
    duration: '',
    location: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<ExplorePlan | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('All');

  const QUICK_FILTERS = [
    { id: 'All', label: 'All Protocols', icon: Sparkles },
    { id: 'Fat Loss', label: 'Fat Loss', icon: Flame },
    { id: 'Muscle Gain', label: 'Muscle Gain', icon: Activity },
    { id: 'Strength', label: 'Strength', icon: Zap },
    { id: 'Home', label: 'Home Workouts', icon: MapPin },
    { id: 'Gym', label: 'Gym Protocols', icon: Dumbbell }
  ];

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPlanElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadInitialPlans = async () => {
    setLoading(true);
    try {
      const { plans: initialPlans, lastDoc: newLastDoc } = await fetchExplorePlans({ ...filters, sortBy });
      setPlans(initialPlans);
      setLastDoc(newLastDoc);
      setHasMore(initialPlans.length === PLANS_PER_PAGE);
    } catch (err) {
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const { plans: morePlans, lastDoc: newLastDoc } = await fetchExplorePlans({ ...filters, sortBy }, lastDoc);
      setPlans(prev => [...prev, ...morePlans]);
      setLastDoc(newLastDoc);
      setHasMore(morePlans.length === PLANS_PER_PAGE);
    } catch (err) {
      console.error("Error loading more plans:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Local filtering and deduplication for fast UX
  const seenIdentifiers = new Set<string>();
  const filteredPlans = plans.filter(plan => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || (
      plan.title?.toLowerCase().includes(searchLower) ||
      plan.goal?.toLowerCase().includes(searchLower) ||
      plan.level?.toLowerCase().includes(searchLower) ||
      plan.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );

    const matchesQuickFilter = activeQuickFilter === 'All' || 
      plan.goal?.toLowerCase().includes(activeQuickFilter.toLowerCase()) ||
      plan.location?.toLowerCase().includes(activeQuickFilter.toLowerCase()) ||
      plan.tags?.some(tag => tag.toLowerCase().includes(activeQuickFilter.toLowerCase()));

    if (!(matchesSearch && matchesQuickFilter)) return false;

    // Deduplication logic: use inputsHash if available, otherwise fallback to title
    const identifier = plan.inputsHash || plan.title;
    if (seenIdentifiers.has(identifier)) return false;
    seenIdentifiers.add(identifier);
    return true;
  });

  const loadTrending = async () => {
    const trending = await fetchTrendingPlans();
    // Deduplicate trending plans
    const seen = new Set<string>();
    const uniqueTrending = trending.filter(plan => {
      const identifier = plan.inputsHash || plan.title;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
    setTrendingPlans(uniqueTrending);
  };

  useEffect(() => {
    loadTrending();
  }, []);

  useEffect(() => {
    loadInitialPlans();
  }, [filters.goal, filters.level, filters.duration, filters.location, sortBy]);

  const handlePreview = async (plan: ExplorePlan) => {
    if (plan.planData) {
      setSelectedPlan(plan);
      return;
    }

    setLoadingDetails(plan.id);
    try {
      const fullPlan = await fetchPlanDetails(plan.id);
      if (fullPlan) {
        // Update the plan in our lists so we don't fetch it again
        setPlans(prev => prev.map(p => p.id === plan.id ? fullPlan : p));
        setTrendingPlans(prev => prev.map(p => p.id === plan.id ? fullPlan : p));
        setSelectedPlan(fullPlan);
      }
    } catch (err) {
      console.error("Error fetching plan details:", err);
    } finally {
      setLoadingDetails(null);
    }
  };

  const handleDownload = async (plan: ExplorePlan) => {
    let planToDownload = plan;
    
    if (!plan.planData) {
      setLoadingDetails(plan.id);
      try {
        const fullPlan = await fetchPlanDetails(plan.id);
        if (fullPlan) {
          setPlans(prev => prev.map(p => p.id === plan.id ? fullPlan : p));
          setTrendingPlans(prev => prev.map(p => p.id === plan.id ? fullPlan : p));
          planToDownload = fullPlan;
        } else {
          return;
        }
      } catch (err) {
        console.error("Error fetching plan details for download:", err);
        return;
      } finally {
        setLoadingDetails(null);
      }
    }

    const inputs = (planToDownload as any).inputs || {
      primaryGoal: plan.goal || '—',
      fitnessLevel: plan.level || '—',
      planDuration: plan.duration || '—',
      workoutLocation: plan.location || '—',
      age: '—',
      gender: '—',
      height: '—',
      heightUnit: '',
      weight: '—',
      weightUnit: ''
    };

    await generateProgrammaticPDF(planToDownload.planData!, inputs, "Elite Athlete");
    await incrementDownloadCount(plan.id);
    
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p));
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Elite AI Workout Protocols | Fitin60ai.in",
    "description": "Browse our collection of elite, AI-generated workout and diet protocols. Find the perfect plan for fat loss, muscle gain, or strength.",
    "url": "https://fitin60ai.in/explore",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": plans.slice(0, 10).map((plan, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": plan.title,
        "description": `${plan.goal} plan for ${plan.level} level. Duration: ${plan.duration}.`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-20 selection:bg-neon selection:text-black">
      <SEO 
        title={`Elite AI Workout Protocols | Fitin60ai.in`}
        description={`Browse our collection of elite, AI-generated workout and diet protocols. Find the perfect plan for fat loss, muscle gain, or strength.`}
        canonical="https://fitin60ai.in/explore"
        schema={collectionSchema}
      />
      {/* Hero Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-neon/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* Header Section */}
        <section className="space-y-10">
          <div className="flex flex-col space-y-4 max-w-3xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                aria-label="Go back"
                className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 text-zinc-500 hover:text-white hover:border-white/10 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-black uppercase tracking-[0.2em] w-fit"
              >
                <Sparkles className="w-3 h-3" />
                AI-Curated Protocols
              </motion.div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none"
            >
              Elite <span className="text-neon">Protocols</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 font-medium text-lg md:text-xl max-w-2xl leading-relaxed"
            >
              Access the world's most advanced AI-generated fitness blueprints. Precision-engineered for maximum performance and body composition.
            </motion.p>
          </div>

          <div className="sticky top-24 z-40 space-y-6 bg-zinc-950/80 backdrop-blur-xl p-4 -mx-4 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-neon transition-colors" />
                <input 
                  type="text"
                  placeholder="Search by title, goal, or level..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all"
                />
              </div>
              <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-neon text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <List className="w-3.5 h-3.5" />
                  List
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveQuickFilter(filter.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeQuickFilter === filter.id 
                      ? 'bg-neon/10 border-neon/30 text-neon shadow-[0_0_20px_rgba(204,255,0,0.1)]' 
                      : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                  }`}
                >
                  <filter.icon className="w-3.5 h-3.5" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        {!search && activeQuickFilter === 'All' && trendingPlans.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tight">Trending Now</h2>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/20 to-transparent ml-8 hidden md:block" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPlans.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onPreview={() => handlePreview(plan)}
                  onDownload={() => handleDownload(plan)}
                  isLoading={loadingDetails === plan.id}
                  isTrending
                />
              ))}
            </div>
          </section>
        )}

        {/* Main List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black italic uppercase tracking-tight">
                {activeQuickFilter === 'All' ? 'All Protocols' : `${activeQuickFilter} Protocols`}
              </h2>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {filteredPlans.length} Results
              </span>
            </div>
          </div>

          {loading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-7 h-[400px] animate-pulse space-y-6">
                  <div className="w-12 h-6 bg-zinc-800 rounded-full" />
                  <div className="space-y-3">
                    <div className="w-3/4 h-8 bg-zinc-800 rounded-xl" />
                    <div className="w-1/2 h-4 bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-zinc-800 rounded-lg" />
                    <div className="w-16 h-6 bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="h-10 bg-zinc-800 rounded-lg" />
                    <div className="h-10 bg-zinc-800 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlans.length > 0 ? (
            <motion.div 
              layout
              className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            >
              <AnimatePresence mode="popLayout">
                {filteredPlans.map((plan, index) => (
                  <motion.div 
                    layout
                    key={plan.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    ref={index === filteredPlans.length - 1 ? lastPlanElementRef : null}
                  >
                    <PlanCard 
                      plan={plan} 
                      onPreview={() => handlePreview(plan)}
                      onDownload={() => handleDownload(plan)}
                      isLoading={loadingDetails === plan.id}
                      layout={viewMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5 backdrop-blur-sm"
            >
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
                <Search className="w-10 h-10 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">No Protocols Found</h3>
              <p className="text-zinc-500 font-bold text-lg max-w-md mx-auto">
                We couldn't find any protocols matching your current search or filters.
              </p>
              <button 
                onClick={() => {
                  setSearch('');
                  setActiveQuickFilter('All');
                  setFilters({ goal: '', level: '', duration: '', location: '' });
                }}
                className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all active:scale-95"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}

          {loadingMore && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 text-neon animate-spin" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Loading More Protocols...</p>
            </div>
          )}
        </section>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <PlanPreviewModal 
            plan={selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
            onDownload={() => handleDownload(selectedPlan)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface PlanCardProps {
  plan: ExplorePlan;
  onPreview: () => void;
  onDownload: () => void;
  layout?: 'grid' | 'list';
  isTrending?: boolean;
  isLoading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onPreview, onDownload, layout = 'grid', isTrending, isLoading }) => {
  const isNew = plan.createdAt && (new Date().getTime() - new Date(plan.createdAt.seconds * 1000).getTime()) < 7 * 24 * 60 * 60 * 1000;

  if (layout === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-6 hover:bg-zinc-900/60 transition-all group backdrop-blur-xl relative overflow-hidden"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-neon/10 flex items-center justify-center text-neon shrink-0 border border-neon/20 relative">
            {isLoading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Activity className="w-7 h-7" />
            )}
            {isNew && (
              <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-neon text-black text-[8px] font-black uppercase rounded-lg shadow-lg">New</div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white uppercase italic tracking-tight truncate group-hover:text-neon transition-colors">{plan.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">
              <span className="flex items-center gap-1.5 text-zinc-300"><Target className="w-3 h-3" /> {plan.goal}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> {plan.level}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {plan.duration}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {plan.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-zinc-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-white">{plan.rating ? plan.rating.toFixed(1) : '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-zinc-400" />
              <span className="text-white">{plan.downloads !== undefined && plan.downloads !== null ? plan.downloads : '—'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onPreview}
              disabled={isLoading}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all group/btn disabled:opacity-50"
              title="Preview Protocol"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
            </button>
            <button 
              onClick={onDownload}
              disabled={isLoading}
              className="px-6 py-3 bg-neon text-black rounded-xl font-black uppercase italic text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Get PDF"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-7 flex flex-col h-full hover:bg-zinc-900/60 transition-all group relative overflow-hidden backdrop-blur-xl ${isTrending ? 'ring-1 ring-orange-500/20' : ''}`}
    >
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] rounded-full transition-all duration-500 ${isTrending ? 'bg-orange-500/10 group-hover:bg-orange-500/20' : 'bg-neon/5 group-hover:bg-neon/10'}`} />

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2 bg-zinc-950/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-white">{plan.rating ? plan.rating.toFixed(1) : '—'}</span>
        </div>
        {isNew && (
          <div className="px-3 py-1 bg-neon text-black text-[9px] font-black uppercase rounded-lg shadow-[0_0_15px_rgba(204,255,0,0.3)]">New</div>
        )}
        {isTrending && !isNew && (
          <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)]">Trending</div>
        )}
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-[1.1] group-hover:text-neon transition-colors duration-300">
            {plan.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-1.5"><Target className="w-3 h-3" /> {plan.goal}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> {plan.level}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {plan.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
              {tag}
            </span>
          )) || (
            <>
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-white/5 flex items-center gap-1.5">
                <Clock className="w-2.5 h-2.5" /> {plan.duration}
              </span>
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-white/5 flex items-center gap-1.5">
                <MapPin className="w-2.5 h-2.5" /> {plan.location}
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
          <div className="space-y-1.5">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Duration</p>
            <p className="text-sm font-bold text-zinc-200 italic flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neon" />
              {plan.duration}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Downloads</p>
            <p className="text-sm font-bold text-zinc-200 italic flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-neon" />
              {plan.downloads !== undefined && plan.downloads !== null ? plan.downloads : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <button 
          onClick={onPreview}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-4 bg-zinc-950 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all group/btn disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-neon" />
          ) : (
            <Eye className="w-4 h-4 text-zinc-500 group-hover/btn:text-white transition-colors" />
          )}
          {isLoading ? "Loading..." : "Preview"}
        </button>
        <button 
          onClick={onDownload}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-4 bg-neon text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_25px_rgba(204,255,0,0.15)] hover:shadow-[0_0_35px_rgba(204,255,0,0.25)] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isLoading ? "Loading..." : "Get PDF"}
        </button>
      </div>
    </motion.div>
  );
};

export default ExplorePlans;
