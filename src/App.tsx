import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
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

type AppState = 'landing' | 'form' | 'generating' | 'preview' | 'terms' | 'privacy';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userInputs, setUserInputs] = useState<UserInputs | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReviewPromptOpen, setIsReviewPromptOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI Engine...');
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [exportUserName, setExportUserName] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

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
    if (appState === 'generating') {
      setProgress(0);
      setLoadingMessage(loadingMessages[0].message);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
          const nextProgress = prev + increment;
          
          // Update message based on threshold
          const currentMsg = [...loadingMessages].reverse().find(m => nextProgress >= m.threshold);
          if (currentMsg && currentMsg.message !== loadingMessage) {
            setLoadingMessage(currentMsg.message);
          }
          
          return nextProgress;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleStart = () => {
    setAppState('form');
  };

  const getCacheKey = (inputs: UserInputs) => {
    // Normalize height to CM
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

    // Normalize weight to KG
    let w = parseFloat(inputs.weight);
    if (inputs.weightUnit === 'lbs') {
      w = w * 0.453592;
    }

    // Grouping into ranges for fuzzy matching
    const ageRange = Math.floor(parseInt(inputs.age) / 5) * 5;
    const weightRange = Math.floor(w / 5) * 5;
    const heightRange = Math.floor(h / 5) * 5;

    return `plan_fuzzy_${inputs.primaryGoal}_${inputs.fitnessLevel}_${ageRange}_${inputs.gender}_${weightRange}_${heightRange}_${inputs.daysPerWeek}_${inputs.workoutLocation}`;
  };

  const handleFormSubmit = async (inputs: UserInputs) => {
    setUserInputs(inputs);
    setAppState('generating');
    setError(null);
    setIsCached(false);
    
    const cacheKey = getCacheKey(inputs);
    const localCachedPlan = localStorage.getItem(cacheKey);

    if (localCachedPlan) {
      setIsCached(true);
      // Simulate a quick "finding" process for UX
      setTimeout(() => {
        setPlan(JSON.parse(localCachedPlan));
        setAppState('preview');
      }, 1500);
      return;
    }

    try {
      const { plan: generatedPlan, fromCache } = await generatePlan(inputs);
      setPlan(generatedPlan);
      setIsCached(fromCache);
      
      // Save to local cache for next time
      localStorage.setItem(cacheKey, JSON.stringify(generatedPlan));
      
      // If it was from global cache, we might want to skip the "generating" delay
      // but the service already returns quickly. The UI will transition when state updates.
      setAppState('preview');
    } catch (err) {
      console.error(err);
      setError('Failed to generate plan. Please try again.');
      setAppState('form');
    }
  };

  const handleRegenerate = async () => {
    if (!userInputs) return;
    setAppState('generating');
    setError(null);
    
    try {
      const { plan: generatedPlan } = await generatePlan(userInputs);
      setPlan(generatedPlan);
      setAppState('preview');
    } catch (err) {
      console.error(err);
      setError('Failed to regenerate plan. Please try again.');
      setAppState('preview');
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
    // Optionally return to landing page or stay on preview
    setAppState('landing');
    setPlan(null);
    setUserInputs(null);
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-100 font-sans selection:bg-neon selection:text-black overflow-x-hidden transition-all duration-500">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage 
              onStart={handleStart} 
              onShowTerms={() => setAppState('terms')} 
              onShowPrivacy={() => setAppState('privacy')}
            />
          </motion.div>
        )}

        {appState === 'terms' && (
          <motion.div
            key="terms"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <TermsPage onBack={() => setAppState('landing')} />
          </motion.div>
        )}

        {appState === 'privacy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <PrivacyPage onBack={() => setAppState('landing')} />
          </motion.div>
        )}
        
        {appState === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[100dvh] bg-zinc-950"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 m-6 rounded-2xl text-center font-medium">
                {error}
              </div>
            )}
            <MultiStepForm 
              onSubmit={handleFormSubmit} 
              onShowTerms={() => setAppState('terms')}
            />
          </motion.div>
        )}
        
        {appState === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-12 bg-zinc-950"
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
        )}
        
        {appState === 'preview' && plan && userInputs && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-950 min-h-[100dvh]"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 m-6 rounded-2xl text-center font-medium fixed top-0 left-0 right-0 z-50 backdrop-blur-md flex flex-col items-center gap-3">
                <p>{error}</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setError(null);
                      generatePDF();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all"
                  >
                    Retry Generation
                  </button>
                  <button 
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <PlanPreview 
              plan={plan} 
              inputs={userInputs} 
              onRegenerate={handleRegenerate}
              onExport={handleExportClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      <CookieConsent onShowPolicy={() => setAppState('cookies')} />
    </div>
  );
}
