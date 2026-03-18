import React, { useRef } from 'react';
import { GeneratedPlan, UserInputs } from '../types';
import { Download, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PlanPreviewProps {
  plan: GeneratedPlan;
  inputs: UserInputs;
  onRegenerate: () => void;
  onExport: () => void;
}

export default function PlanPreview({ plan, inputs, onRegenerate, onExport }: PlanPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6 pb-32">
      {/* Hidden Printable A4 Layout for PDF Export */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        <div id="pdf-content-light" className="w-[800px] bg-white text-black p-10 font-sans">
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">Personalized Fitness & Diet Plan</h1>
            <p className="text-gray-600">Designed for {inputs.primaryGoal} • {inputs.planDuration}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">Profile Summary</h2>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div><span className="font-semibold text-gray-500 block">Stats</span>{inputs.age} yrs • {inputs.height}cm • {inputs.weight}kg</div>
              <div><span className="font-semibold text-gray-500 block">Body Type</span>{inputs.bodyType}</div>
              <div><span className="font-semibold text-gray-500 block">Fitness Level</span>{inputs.fitnessLevel}</div>
              <div><span className="font-semibold text-gray-500 block">Activity</span>{inputs.activityLevel}</div>
            </div>
          </div>

          <div className="mb-8 break-before-auto">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">Workout Schedule</h2>
            {plan.workout.weeklySplit.map((day, i) => (
              <div key={i} className="mb-6 break-inside-avoid">
                <div className="bg-gray-100 p-3 font-bold text-gray-800 border-l-4 border-emerald-600 mb-2">
                  {day.day} - <span className="text-emerald-600">{day.focus}</span>
                </div>
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-gray-600">
                      <th className="py-2 px-2 w-1/3">Exercise</th>
                      <th className="py-2 px-2 w-1/6">Sets × Reps</th>
                      <th className="py-2 px-2 w-1/6">Rest</th>
                      <th className="py-2 px-2 w-1/3">Alternative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((ex, j) => (
                      <tr key={j} className="border-b border-gray-200">
                        <td className="py-2 px-2">
                          <div className="font-bold text-gray-800">{ex.name}</div>
                          <div className="text-xs text-gray-500">{ex.notes}</div>
                        </td>
                        <td className="py-2 px-2 font-semibold text-emerald-600">{ex.setsReps}</td>
                        <td className="py-2 px-2 text-gray-600">{ex.rest}</td>
                        <td className="py-2 px-2 text-gray-600 text-xs">{ex.alternative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="mb-8 break-before-page">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase tracking-wide">Nutrition Guide</h2>
            <div className="flex justify-between bg-gray-100 p-4 rounded mb-4 border-l-4 border-emerald-600">
              <div>
                <span className="block text-xs text-gray-500 uppercase font-bold">Daily Target</span>
                <span className="text-2xl font-bold text-emerald-600">{plan.diet.dailyCalories} kcal</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div><span className="block text-gray-500">Protein</span><span className="font-bold">{plan.diet.macros.protein}</span></div>
                <div><span className="block text-gray-500">Carbs</span><span className="font-bold">{plan.diet.macros.carbs}</span></div>
                <div><span className="block text-gray-500">Fats</span><span className="font-bold">{plan.diet.macros.fats}</span></div>
              </div>
            </div>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-600">
                  <th className="py-2 px-2 w-1/4">Meal</th>
                  <th className="py-2 px-2 w-1/2">Options</th>
                  <th className="py-2 px-2 w-1/4">Alternative</th>
                </tr>
              </thead>
              <tbody>
                {plan.diet.meals.map((meal, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3 px-2 font-bold text-emerald-600 align-top">{meal.name}</td>
                    <td className="py-3 px-2 align-top">
                      <ul className="list-disc list-inside text-gray-800 space-y-1">
                        {meal.options.map((opt, j) => <li key={j}>{opt}</li>)}
                      </ul>
                    </td>
                    <td className="py-3 px-2 text-gray-600 text-xs align-top italic">{meal.alternatives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-500 break-inside-avoid">
            <h3 className="font-bold text-gray-700 mb-2 uppercase">Safety & Disclaimer</h3>
            <ul className="list-disc list-inside space-y-1 mb-6">
              {plan.safetyNotes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
            <div className="text-center mt-8 pt-4 border-t border-gray-200">
              Generated by Fitness AI • fitness-ai.app
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative" ref={contentRef} id="pdf-content">
        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0 overflow-hidden">
          <div className="text-[150px] font-black rotate-[-45deg] whitespace-nowrap">
            FITNESS AI
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center space-y-4 pt-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Personalized Plan</h1>
          <p className="text-zinc-600 text-lg">Designed for {inputs.primaryGoal} • {inputs.planDuration}</p>
        </div>

        {/* User Summary */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#10b9811a] text-emerald-600 flex items-center justify-center text-sm shrink-0">1</span>
            Profile Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Stats</p>
              <p className="font-medium text-zinc-900">{inputs.age} yrs<br/>{inputs.height}cm<br/>{inputs.weight}kg</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Body Type</p>
              <p className="font-medium text-zinc-900">{inputs.bodyType}</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Fitness Level</p>
              <p className="font-medium text-zinc-900">{inputs.fitnessLevel}</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Activity</p>
              <p className="font-medium text-zinc-900">{inputs.activityLevel}</p>
            </div>
          </div>
        </div>

        {/* Workout Plan */}
        <div className="space-y-6 break-before-page">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#10b9811a] text-emerald-600 flex items-center justify-center text-lg shrink-0">2</span>
            Workout Schedule
          </h2>
          <div className="space-y-4">
            {plan.workout.weeklySplit.map((day, i) => (
              <details key={i} className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden break-inside-avoid" open={true}>
                <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer select-none">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">{day.day}</h3>
                    <p className="text-emerald-600 font-medium mt-1 text-sm md:text-base">{day.focus}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-open:rotate-180 transition-transform shrink-0">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
                  <div className="space-y-4 md:space-y-0 md:overflow-x-auto">
                    {/* Mobile View: Cards */}
                    <div className="md:hidden space-y-4">
                      {day.exercises.map((ex, j) => (
                        <div key={j} className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                          <p className="font-semibold text-zinc-900 mb-1">{ex.name}</p>
                          <p className="text-xs text-zinc-500 mb-3">{ex.notes}</p>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium">{ex.setsReps}</span>
                            <span className="px-3 py-1.5 bg-zinc-200 text-zinc-700 rounded-lg">{ex.rest} rest</span>
                          </div>
                          {ex.alternative && (
                            <div className="mt-3 pt-3 border-t border-zinc-200">
                              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Alternative</p>
                              <p className="text-sm text-zinc-700">{ex.alternative}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Table */}
                    <table className="hidden md:table w-full text-left text-sm">
                      <thead>
                        <tr className="text-zinc-500 border-b border-zinc-200">
                          <th className="pb-3 font-medium">Exercise</th>
                          <th className="pb-3 font-medium">Sets × Reps</th>
                          <th className="pb-3 font-medium">Rest</th>
                          <th className="pb-3 font-medium">Alternative</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {day.exercises.map((ex, j) => (
                          <tr key={j}>
                            <td className="py-4 pr-4">
                              <p className="font-medium text-zinc-800">{ex.name}</p>
                              <p className="text-xs text-zinc-500 mt-1">{ex.notes}</p>
                            </td>
                            <td className="py-4 pr-4 whitespace-nowrap text-emerald-600 font-medium">{ex.setsReps}</td>
                            <td className="py-4 pr-4 whitespace-nowrap text-zinc-600">{ex.rest}</td>
                            <td className="py-4 text-zinc-600">{ex.alternative}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Diet Plan */}
        <div className="space-y-6 break-before-page">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#10b9811a] text-emerald-600 flex items-center justify-center text-lg shrink-0">3</span>
            Nutrition Guide
          </h2>
          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
            <div className="p-5 md:p-6 border-b border-zinc-200 bg-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Daily Target</p>
                <p className="text-3xl font-bold text-emerald-600">{plan.diet.dailyCalories} <span className="text-lg text-zinc-600 font-normal">kcal</span></p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-6 w-full md:w-auto">
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Protein</p>
                  <p className="font-bold text-zinc-900">{plan.diet.macros.protein}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Carbs</p>
                  <p className="font-bold text-zinc-900">{plan.diet.macros.carbs}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-center">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Fats</p>
                  <p className="font-bold text-zinc-900">{plan.diet.macros.fats}</p>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="space-y-6 md:space-y-0 md:overflow-x-auto">
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {plan.diet.meals.map((meal, i) => (
                    <div key={i} className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                      <h4 className="font-bold text-emerald-600 mb-3 text-lg">{meal.name}</h4>
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Options</p>
                        <ul className="list-disc list-inside text-zinc-800 space-y-1 text-sm">
                          {meal.options.map((opt, j) => <li key={j}>{opt}</li>)}
                        </ul>
                      </div>
                      <div className="pt-3 border-t border-zinc-200">
                        <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Alternative</p>
                        <div className="flex items-start gap-2 text-sm text-zinc-700">
                          <RefreshCw className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
                          <span>{meal.alternatives}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <table className="hidden md:table w-full text-left text-sm">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-200">
                      <th className="pb-3 font-medium w-1/4">Meal</th>
                      <th className="pb-3 font-medium w-1/2">Options</th>
                      <th className="pb-3 font-medium w-1/4">Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {plan.diet.meals.map((meal, i) => (
                      <tr key={i}>
                        <td className="py-4 pr-4 align-top">
                          <h4 className="font-semibold text-emerald-600">{meal.name}</h4>
                        </td>
                        <td className="py-4 pr-4 align-top">
                          <ul className="list-disc list-inside text-zinc-700 space-y-1">
                            {meal.options.map((opt, j) => <li key={j}>{opt}</li>)}
                          </ul>
                        </td>
                        <td className="py-4 align-top text-zinc-600">
                          <div className="flex items-start gap-2">
                            <RefreshCw className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{meal.alternatives}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Notes */}
        <div className="bg-[#f59e0b1a] border border-[#f59e0b33] rounded-2xl p-6 break-inside-avoid">
          <h3 className="text-amber-500 font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" />
            Safety & Disclaimer
          </h3>
          <ul className="space-y-2 text-[#f59e0bcc] text-sm list-disc list-inside">
            {plan.safetyNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white md:bg-gradient-to-t md:from-white md:via-white/90 md:to-transparent border-t border-zinc-200 md:border-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4">
          <button
            onClick={onRegenerate}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl md:rounded-full bg-zinc-100 md:bg-white border border-transparent md:border-zinc-200 text-zinc-700 font-semibold md:font-medium hover:bg-zinc-200 md:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Regenerate Plan
          </button>
          <button
            onClick={onExport}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl md:rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#10b98133]"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
