
import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, Language } from '../types';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === value) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 md:gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] py-2 border-b border-transparent hover:border-zinc-200 transition-all group px-2 -mx-2"
      >
        <span className="text-zinc-900 group-hover:opacity-60">{currentLang.name}</span>
        <svg 
          className={`w-2.5 h-2.5 md:w-3 h-3 transition-transform duration-700 text-zinc-200 group-hover:text-black ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 md:mt-6 w-64 glass border border-zinc-100 dropdown-shadow py-6 md:py-8 z-50 animate-reveal origin-top-right rounded-sm">
          <div className="flex flex-col max-h-[60vh] md:max-h-[480px] overflow-y-auto scrollbar-hide px-3 md:px-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 md:px-6 md:py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] transition-all rounded-sm group/item mb-1 last:mb-0 ${
                  value === lang.code 
                    ? 'bg-zinc-900 text-white shadow-xl' 
                    : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{lang.name}</span>
                  {value === lang.code && <div className="w-1 h-1 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
