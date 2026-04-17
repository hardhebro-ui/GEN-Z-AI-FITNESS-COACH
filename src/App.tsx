import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MultiStepForm from './components/MultiStepForm';
import PlanPreview from './components/PlanPreview';
import ExportModal from './components/ExportModal';
import ReviewPrompt from './components/ReviewPrompt';
import CookieConsent from './components/CookieConsent';
import PageLoader, { fitnessFacts } from './components/PageLoader';
import { UserInputs, GeneratedPlan } from './types';
import { generatePlan } from './services/geminiService';
import { generateProgrammaticPDF } from './services/pdfService';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { guides } from './data/guides';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const KnowledgeBasePage = lazy(() => import('./pages/GuidesPage'));
const GuidePage = lazy(() => import('./components/GuidePage'));

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInputs, setUserInputs] = useState<UserInputs | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReviewPromptOpen, setIsReviewPromptOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI Engine...');
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [exportUserName, setExportUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadingMessages = [
    { threshold: 0, message: 'Initializing AI Engine...' },
    { threshold: 10, message: 'Analyzing your body type...' },
    { threshold: 25, message: 'Calculating metabolic rate...' },
    { threshold: 40, message: 'Performing Safety Check...' },
    { threshold: 55, message: 'Designing your workout split...' },
    { threshold: 70, message: 'Creating your diet plan...' },
    { threshold: 85, message: 'Finalizing elite protocol...' },
    { threshold: 95, message: 'Securing your data...' },
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    let factInterval: NodeJS.Timeout;
    if (isGenerating) {
      factInterval = setInterval(() => {
        setCurrentFactIndex(prev => (prev + 1) % fitnessFacts.length);
      }, 4000);
    }
    return () => clearInterval(factInterval);
  }, [isGenerating]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setProgress(0);
      setLoadingMessage(loadingMessages[0].message);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
          const nextProgress = prev + increment;
          
          const currentMsg = [...loadingMessages].reverse().find(m => nextProgress >= m.threshold);
          if (currentMsg && currentMsg.message !== loadingMessage) {
            setLoadingMessage(currentMsg.message);
          }
          
          return nextProgress;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    // Scroll to anchor if present in URL
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const handleStart = () => {
    navigate('/generate');
  };

  const getCacheKey = (inputs: UserInputs) => {
    let h = parseFloat(inputs.height);
    if (inputs.heightUnit === 'ft/in') {
      if (inputs.height.includes("'")) {
        const parts = inputs.height.split("'");
        const ft = parseFloat(parts[0]) || 0;
        const inches = parseFloat(parts[1]?.replace('"', '')) || 0;
        h = (ft * 12 + inches) * 2.54;
      } else {
        h = h * 30.48;
      }
    }

    let w = parseFloat(inputs.weight);
    if (inputs.weightUnit === 'lbs') {
      w = w * 0.453592;
    }

    const ageRange = Math.floor(parseInt(inputs.age) / 5) * 5;
    const weightRange = Math.floor(w / 5) * 5;
    const heightRange = Math.floor(h / 5) * 5;

    return `plan_fuzzy_${inputs.primaryGoal}_${inputs.fitnessLevel}_${ageRange}_${inputs.gender}_${weightRange}_${heightRange}_${inputs.daysPerWeek}_${inputs.workoutLocation}`;
  };

  const handleFormSubmit = async (inputs: UserInputs, force: boolean = false) => {
    setUserInputs(inputs);
    setIsGenerating(true);
    setError(null);
    setIsCached(false);
    
    const cacheKey = getCacheKey(inputs);
    const localCachedPlan = localStorage.getItem(cacheKey);

    if (localCachedPlan && !force) {
      setIsCached(true);
      setTimeout(() => {
        setPlan(JSON.parse(localCachedPlan));
        setIsGenerating(false);
        navigate('/plan');
      }, 1500);
      return;
    }

    try {
      const { plan: generatedPlan, fromCache } = await generatePlan(inputs, force);
      setPlan(generatedPlan);
      setIsCached(fromCache);
      localStorage.setItem(cacheKey, JSON.stringify(generatedPlan));
      setIsGenerating(false);
      navigate('/plan');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'MISSING_API_KEY') {
        setError('Gemini API Key is missing. Please set GEMINI_API_KEY in your environment.');
      } else {
        setError(err.message || 'Failed to generate plan. Please try again.');
      }
      setIsGenerating(false);
      navigate('/generate');
    }
  };

  const handleRegenerate = async () => {
    if (!userInputs) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const { plan: generatedPlan } = await generatePlan(userInputs, true);
      setPlan(generatedPlan);
      setIsGenerating(false);
      navigate('/plan');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'MISSING_API_KEY') {
        setError('Gemini API Key is missing. Please set GEMINI_API_KEY in your environment.');
      } else {
        setError(err.message || 'Failed to regenerate plan. Please try again.');
      }
      setIsGenerating(false);
    }
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleUnlock = async (name: string) => {
    setExportUserName(name);
    setIsExportModalOpen(false);
    generatePDF();
  };

  const generatePDF = async () => {
    if (!plan || !userInputs) return;

    try {
      await generateProgrammaticPDF(plan, userInputs, exportUserName);
      setTimeout(() => {
        setIsReviewPromptOpen(true);
      }, 1000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handleReviewSubmit = () => {
    setIsReviewPromptOpen(false);
    navigate('/');
    setPlan(null);
    setUserInputs(null);
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-100 font-sans selection:bg-neon selection:text-black overflow-x-hidden transition-all duration-500">
      {!location.pathname.startsWith('/admin') && (
        <Navbar onNavigate={(path) => navigate(path)} currentState={location.pathname} />
      )}

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-12 bg-zinc-950 fixed inset-0 z-[100]"
            data-google-adsense-ignore="true"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-neon/20 blur-3xl rounded-full animate-pulse" />
              <Loader2 className="w-24 h-24 md:w-32 md:h-32 text-neon animate-spin relative z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-xl md:text-2xl font-black text-neon font-display">{progress}%</span>
              </div>
            </div>
            <div className="space-y-6 max-w-lg relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display italic uppercase">
                {isCached ? 'Found a Similar Plan!' : 'Crafting Your Plan...'}
              </h2>
              <div className="h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-zinc-400 text-lg md:text-xl leading-relaxed"
                  >
                    {isCached 
                      ? 'We found a plan in our database that perfectly matches your profile. Loading it for you now...' 
                      : loadingMessage}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Added Publisher Content: Fitness Facts */}
            <div className="max-w-md w-full p-8 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4 relative z-10">
              <p className="text-neon text-[10px] font-black uppercase tracking-[0.3em]">Did You Know?</p>
              <div className="h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFactIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-zinc-300 text-base md:text-lg font-medium italic leading-relaxed"
                  >
                    "{fitnessFacts[currentFactIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage onStart={handleStart} />} />
              <Route path="/explore" element={<ExplorePage onBack={() => navigate('/')} lastInputs={userInputs} />} />
              <Route path="/guides" element={<KnowledgeBasePage onShowGuide={(id) => navigate(`/guides/${id}`)} />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/terms-conditions" element={<TermsPage onBack={() => navigate(-1)} />} />
              <Route path="/privacy-policy" element={<PrivacyPage onBack={() => navigate(-1)} />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              
              {/* Anchor Redirects */}
              <Route path="/process" element={<Navigate to="/#process" replace />} />
              <Route path="/why-ai" element={<Navigate to="/#benefits" replace />} />
              <Route path="/faq" element={<Navigate to="/#faq" replace />} />
              <Route path="/reviews" element={<Navigate to="/#reviews" replace />} />
              <Route path="/about-us" element={<Navigate to="/#about" replace />} />
              <Route path="/contact-us" element={<Navigate to="/#contact" replace />} />
              
              {/* Legacy Redirects */}
              <Route path="/how-it-works" element={<Navigate to="/#process" replace />} />
              <Route path="/ai-fitness-benefits" element={<Navigate to="/#benefits" replace />} />
              <Route path="/blog" element={<Navigate to="/guides" replace />} />
              <Route path="/explore-plans" element={<Navigate to="/explore" replace />} />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/contact" element={<Navigate to="/#contact" replace />} />
              <Route path="/terms" element={<Navigate to="/terms-conditions" replace />} />
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
              
              <Route path="/generate" element={
                <div className="min-h-[100dvh] bg-zinc-950 pt-20">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 m-6 rounded-2xl text-center font-medium">
                      {error}
                    </div>
                  )}
                  <MultiStepForm 
                    onSubmit={handleFormSubmit} 
                    onShowTerms={() => navigate('/terms-conditions')}
                    onCancel={() => navigate('/')}
                  />
                </div>
              } />
              
              <Route path="/plan" element={
                plan && userInputs ? (
                  <div className="bg-zinc-950 min-h-[100dvh] pt-20">
                    <PlanPreview 
                      plan={plan} 
                      inputs={userInputs} 
                      onRegenerate={handleRegenerate}
                      onExport={handleExportClick}
                    />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              
              <Route path="/guides/:id" element={<GuideWrapper onBack={() => navigate('/guides')} />} />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        )}
      </AnimatePresence>

      {!location.pathname.startsWith('/admin') && <Footer />}

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onUnlock={handleUnlock} />
      <ReviewPrompt isOpen={isReviewPromptOpen} onClose={() => setIsReviewPromptOpen(false)} onSubmit={handleReviewSubmit} initialName={exportUserName} />
      <CookieConsent onShowPolicy={() => navigate('/privacy-policy')} />
    </div>
  );
}

// Helper component to handle guide ID from URL
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function GuideWrapper({ onBack }: { onBack: () => void }) {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGuide = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching guide:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);
  
  if (loading) return <PageLoader />;
  if (!guide) return <HomePage onStart={() => {}} />;
  
  return <GuidePage guide={guide} onBack={onBack} />;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
