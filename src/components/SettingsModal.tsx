
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedApiKey = localStorage.getItem('gemini-api-key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('gemini-api-key', apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-zinc-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white border-t md:border border-zinc-200 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-100 shrink-0">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Key className="w-6 h-6" /> API Settings
            </h3>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors bg-zinc-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 md:p-6 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Gemini API Key</h4>
              <p className="text-sm text-zinc-600">
                You can get your free API key from Google AI Studio. This is required to generate the fitness plans.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="api-key-input">
                Your API Key
              </label>
              <input
                id="api-key-input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 text-base text-zinc-900 focus:ring-2 focus:ring-emerald-600 outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="text-xs text-zinc-500">
                Your API key is stored only in your browser's local storage. It is not sent to our servers.
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 bg-emerald-600 text-white font-semibold text-lg rounded-2xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Save className="w-5 h-5" />
              Save and Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
