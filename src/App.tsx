import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MultiStepForm from './components/MultiStepForm';
import PlanPreview from './components/PlanPreview';
import ExportModal from './components/ExportModal';
import ReviewPrompt from './components/ReviewPrompt';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import CookieConsent from './components/CookieConsent';
import { UserInputs, GeneratedPlan } from './types';
import { generatePlan } from './services/geminiService';
import { generateProgrammaticPDF } from './services/pdfService';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { guides } from './data/guides';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const BenefitsPage = lazy(() => import('./pages/BenefitsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GuidePage = lazy(() => import('./components/GuidePage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950">
    <Loader2 className="w-12 h-12 text-neon animate-spin" />
  </div>
);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  const handleFormSubmit = async (inputs: UserInputs) => {
    setUserInputs(inputs);
    setIsGenerating(true);
    setError(null);
    setIsCached(false);
    
    const cacheKey = getCacheKey(inputs);
    const localCachedPlan = localStorage.getItem(cacheKey);

    if (localCachedPlan) {
      setIsCached(true);
      setTimeout(() => {
        setPlan(JSON.parse(localCachedPlan));
        setIsGenerating(false);
        navigate('/plan');
      }, 1500);
      return;
    }

    try {
      const { plan: generatedPlan, fromCache } = await generatePlan(inputs);
      setPlan(generatedPlan);
      setIsCached(fromCache);
      localStorage.setItem(cacheKey, JSON.stringify(generatedPlan));
      setIsGenerating(false);
      navigate('/plan');
    } catch (err) {
      console.error(err);
      setError('Failed to generate plan. Please try again.');
      setIsGenerating(false);
      navigate('/generate');
    }
  };

  const handleRegenerate = async () => {
    if (!userInputs) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const { plan: generatedPlan } = await generatePlan(userInputs);
      setPlan(generatedPlan);
      setIsGenerating(false);
      navigate('/plan');
    } catch (err) {
      console.error(err);
      setError('Failed to regenerate plan. Please try again.');
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

  const handleShowGuide = (id: string) => {
    navigate(`/guide/${id}`);
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-100 font-sans selection:bg-neon selection:text-black overflow-x-hidden transition-all duration-500">
      <Navbar onNavigate={(path) => navigate(path)} currentState={location.pathname} />

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-12 bg-zinc-950 fixed inset-0 z-[100]"
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
          </motion.div>
        ) : (
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage onStart={handleStart} />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/ai-fitness-benefits" element={<BenefitsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<GuidesPage onShowGuide={handleShowGuide} />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/explore-plans" element={<ExplorePage onBack={() => navigate('/')} lastInputs={userInputs} />} />
              <Route path="/terms" element={<TermsPage onBack={() => navigate(-1)} />} />
              <Route path="/privacy" element={<PrivacyPage onBack={() => navigate(-1)} />} />
              <Route path="/generate" element={
                <div className="min-h-[100dvh] bg-zinc-950 pt-20">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 m-6 rounded-2xl text-center font-medium">
                      {error}
                    </div>
                  )}
                  <MultiStepForm 
                    onSubmit={handleFormSubmit} 
                    onShowTerms={() => navigate('/terms')}
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
                  <HomePage onStart={handleStart} />
                )
              } />
              <Route path="/guide/:id" element={
                <GuideWrapper onBack={() => navigate('/blog')} />
              } />
            </Routes>
          </Suspense>
        )}
      </AnimatePresence>

      <Footer />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onUnlock={handleUnlock} 
      />

      <ReviewPrompt 
        isOpen={isReviewPromptOpen} 
        onClose={() => setIsReviewPromptOpen(false)} 
        onSubmit={handleReviewSubmit} 
        initialName={exportUserName}
      />

      <CookieConsent onShowPolicy={() => navigate('/privacy')} />
    </div>
  );
}

// Helper component to handle guide ID from URL
import { useParams } from 'react-router-dom';
function GuideWrapper({ onBack }: { onBack: () => void }) {
  const { id } = useParams<{ id: string }>();
  const guide = guides.find(g => g.id === id);
  
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
