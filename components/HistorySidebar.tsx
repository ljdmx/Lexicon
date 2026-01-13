
import React from 'react';
import { TranslationItem, SUPPORTED_LANGUAGES } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: TranslationItem[];
  onSelect: (item: TranslationItem) => void;
  onClear: () => void;
  t: any;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, items, onSelect, onClear, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md transition-opacity duration-700" onClick={onClose} />
      
      <div className="relative w-screen max-w-lg pointer-events-auto transform transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] shadow-2xl">
        <div className="h-full flex flex-col bg-white border-l border-zinc-50 overflow-hidden">
          
          <div className="p-12 md:p-20 pb-8 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tighter text-zinc-900">{t.history}</h2>
              <p className="text-[9px] font-bold text-zinc-200 uppercase tracking-widest">{t.subtitle}</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full border border-zinc-50 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-12 md:px-20 py-8 scrollbar-hide space-y-12">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-10 select-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em]">{t.historyEmpty}</span>
              </div>
            ) : (
              <div className="space-y-12 pb-12">
                {items.map((item) => {
                  const lang = SUPPORTED_LANGUAGES.find(l => l.code === item.targetLanguage);
                  return (
                    <button 
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="group w-full text-left space-y-4 block hover:opacity-50 transition-opacity"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-4 decoration-zinc-100">
                          {lang?.name || item.targetLanguage}
                        </span>
                        <span className="text-[8px] font-medium text-zinc-300 uppercase tracking-widest">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono leading-relaxed line-clamp-3">
                        {item.inputJson.substring(0, 150).trim()}...
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-12 md:p-20 pt-8 border-t border-zinc-50">
              <button 
                onClick={onClear}
                className="w-full py-4 text-zinc-300 hover:text-red-500 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-colors"
              >
                {t.clearCache}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;
