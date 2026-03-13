import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MultiStepForm from './components/MultiStepForm';
import PlanPreview from './components/PlanPreview';
import ExportModal from './components/ExportModal';
import ReviewPrompt from './components/ReviewPrompt';
import { UserInputs, GeneratedPlan } from './types';
import { generatePlan } from './services/geminiService';
import { Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

type AppState = 'landing' | 'form' | 'generating' | 'preview';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userInputs, setUserInputs] = useState<UserInputs | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReviewPromptOpen, setIsReviewPromptOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setAppState('form');
  };

  const handleFormSubmit = async (inputs: UserInputs) => {
    setUserInputs(inputs);
    setAppState('generating');
    setError(null);
    
    try {
      const generatedPlan = await generatePlan(inputs);
      setPlan(generatedPlan);
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
      const generatedPlan = await generatePlan(userInputs);
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

  const handleUnlock = async () => {
    setIsExportModalOpen(false);
    
    // Generate PDF
    const element = document.getElementById('pdf-content-light');
    if (element) {
      const opt = {
        margin:       10,
        filename:     'my-fitness-plan.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          windowWidth: 800, // Ensure html2canvas renders the hidden element at correct width
          onclone: (clonedDoc: Document) => {
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach(style => {
              if (style.innerHTML) {
                // Replace unsupported color functions with a fallback to prevent html2canvas from crashing
                style.innerHTML = style.innerHTML
                  .replace(/oklch\([^)]+\)/g, 'rgb(0,0,0)')
                  .replace(/oklab\([^)]+\)/g, 'rgb(0,0,0)')
                  .replace(/color-mix\([^)]+\)/g, 'rgb(0,0,0)');
              }
            });
            // Make the hidden element visible in the cloned document for rendering
            const clonedElement = clonedDoc.getElementById('pdf-content-light');
            if (clonedElement) {
              clonedElement.style.position = 'static';
              clonedElement.style.opacity = '1';
              clonedElement.style.width = '800px';
              clonedElement.style.height = 'auto';
              clonedElement.style.overflow = 'visible';
            }
          }
        },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };
      
      try {
        await html2pdf().set(opt).from(element).save();
        // Show review prompt after download
        setTimeout(() => {
          setIsReviewPromptOpen(true);
        }, 1000);
      } catch (err) {
        console.error('PDF generation failed:', err);
        alert('Failed to generate PDF. Please try again.');
      }
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
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans">
      {appState === 'landing' && <LandingPage onStart={handleStart} />}
      
      {appState === 'form' && (
        <>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 m-6 rounded-xl text-center">
              {error}
            </div>
          )}
          <MultiStepForm onSubmit={handleFormSubmit} />
        </>
      )}
      
      {appState === 'generating' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
          <h2 className="text-3xl font-bold">Crafting Your Plan...</h2>
          <p className="text-zinc-500 max-w-md">
            Our AI is analyzing your profile and generating a personalized workout and diet strategy. This usually takes about 10-15 seconds.
          </p>
        </div>
      )}
      
      {appState === 'preview' && plan && userInputs && (
        <>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 m-6 rounded-xl text-center fixed top-0 left-0 right-0 z-50">
              {error}
            </div>
          )}
          <PlanPreview 
            plan={plan} 
            inputs={userInputs} 
            onRegenerate={handleRegenerate}
            onExport={handleExportClick}
          />
        </>
      )}

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onUnlock={handleUnlock} 
      />

      <ReviewPrompt 
        isOpen={isReviewPromptOpen} 
        onClose={() => setIsReviewPromptOpen(false)} 
        onSubmit={handleReviewSubmit} 
      />
    </div>
  );
}
