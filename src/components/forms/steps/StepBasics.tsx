import React from 'react';
import { motion } from 'motion/react';
import { UserInputs } from '../../../types';
import { StepHeader } from '../StepHeader';
import { Input, Select } from '../../ui/FormElements';
import { UnitToggle } from '../../ui/UnitToggle';

interface StepBasicsProps {
  data: UserInputs;
  updateData: (fields: Partial<UserInputs>) => void;
  bmiData: any;
  description: string;
}

export const StepBasics: React.FC<StepBasicsProps> = ({ data, updateData, bmiData, description }) => {
  const handleHeightToggle = (newUnit: string) => {
    if (data.heightUnit === newUnit) return;
    const heightStr = data.height.toString();
    if (newUnit === 'cm') {
      const ftMatch = heightStr.match(/(\d+)'/);
      const inMatch = heightStr.match(/(\d+)"/);
      let feet = 0;
      let inches = 0;
      if (ftMatch) {
        feet = parseInt(ftMatch[1]);
        if (inMatch) inches = parseInt(inMatch[1]);
      } else {
        feet = parseFloat(heightStr) || 0;
      }
      const cm = Math.round((feet * 30.48) + (inches * 2.54));
      updateData({ heightUnit: 'cm', height: cm.toString() });
    } else {
      const cm = parseFloat(data.height);
      if (!isNaN(cm)) {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        updateData({ heightUnit: 'ft/in', height: `${feet}'${inches}"` });
      } else {
        updateData({ heightUnit: 'ft/in' });
      }
    }
  };

  const handleWeightToggle = (newUnit: string) => {
    if (data.weightUnit === newUnit) return;
    const val = parseFloat(data.weight);
    if (isNaN(val)) {
      updateData({ weightUnit: newUnit as 'kg' | 'lbs' });
      return;
    }
    if (newUnit === 'kg') {
      const kg = (val * 0.453592).toFixed(1);
      updateData({ weightUnit: 'kg', weight: kg });
    } else {
      const lbs = (val / 0.453592).toFixed(1);
      updateData({ weightUnit: 'lbs', weight: lbs });
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader title="The" highlight="Basics" description={description} />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Age (13-80)" 
            type="number" 
            min="13" 
            max="80" 
            value={data.age} 
            onChange={e => updateData({ age: e.target.value })} 
            placeholder="e.g. 25"
            autoFocus 
          />
          <Select 
            label="Gender" 
            value={data.gender} 
            onChange={e => updateData({ gender: e.target.value })} 
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <UnitToggle 
              label="Height" 
              unit={data.heightUnit} 
              onToggle={handleHeightToggle} 
              options={[{ id: 'cm', label: 'CM' }, { id: 'ft/in', label: 'FT' }]} 
            />
            <input
              type="text"
              value={data.height}
              onChange={e => updateData({ height: e.target.value })}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
              placeholder={data.heightUnit === 'cm' ? "e.g. 175" : "e.g. 5'9\""}
            />
          </div>
          <div>
            <UnitToggle 
              label="Weight" 
              unit={data.weightUnit} 
              onToggle={handleWeightToggle} 
              options={[{ id: 'kg', label: 'KG' }, { id: 'lbs', label: 'LB' }]} 
            />
            <input
              type="number"
              value={data.weight}
              onChange={e => updateData({ weight: e.target.value })}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-neon outline-none text-white font-bold transition-all"
              placeholder={data.weightUnit === 'kg' ? "e.g. 70" : "e.g. 154"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Goal Weight" 
            type="number" 
            value={data.goalWeight} 
            onChange={e => updateData({ goalWeight: e.target.value })} 
            placeholder={data.weightUnit === 'kg' ? "e.g. 65" : "e.g. 143"}
          />
          <Select 
            label="Body Fat %" 
            value={data.bodyFatEstimate} 
            onChange={e => updateData({ bodyFatEstimate: e.target.value })} 
            options={[
              { value: '', label: 'Not Sure' },
              { value: 'Low', label: 'Low (< 15%)' },
              { value: 'Average', label: 'Average (15-25%)' },
              { value: 'High', label: 'High (> 25%)' }
            ]}
          />
        </div>
        
        {bmiData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-2xl"
          >
            <div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Body Mass Index</span>
              <span className="text-4xl font-black text-white font-display italic leading-none">{bmiData.value}</span>
            </div>
            <div className={`px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-black uppercase tracking-widest ${bmiData.color}`}>
              {bmiData.category}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
