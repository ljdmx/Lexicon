
import React, { useState, useEffect } from 'react';
import { UILang } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  historyCount: number;
  uiLang: UILang;
  onUiLangChange: (lang: UILang) => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, historyCount, uiLang, onUiLangChange, t }) => {
  const [hasKey, setHasKey] = useState(false);
  const [isEnvReady, setIsEnvReady] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window !== 'undefined' && window.aistudio) {
        setIsEnvReady(true);
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Failed to check API key status:", e);
        }
      }
    };
    
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyConfig = async () => {
    if (typeof window !== 'undefined' && window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // As per guidelines, assume success immediately to mitigate race conditions
        setHasKey(true);
      } catch (e) {
        console.error("Failed to open key selection dialog:", e);
        alert("Unable to open API Key config. Please ensure you are in the correct environment.");
      }
    } else {
      console.warn("window.aistudio.openSelectKey is not available in this environment.");
      alert("API Configuration is only available in the AI Studio environment.");
    }
  };

  return (
    <header className="h-24 md:h-32 flex items-center px-8 md:px-16 border-b border-zinc-100 sticky top-0 glass z-40">
      <div className="max-w-[2000px] mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-12 md:gap-16">
          <div className="text-xl md:text-2xl font-bold tracking-[-0.06em] cursor-default flex items-center gap-2">
            LEXICON<span className="font-extralight text-zinc-400 text-lg">®</span>
          </div>
          <div className="hidden xl:flex flex-col border-l border-zinc-200 pl-8 h-8 justify-center">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.5em]">{t.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-8 md:gap-16">
          <div className="flex gap-8">
            {(['zh', 'en'] as UILang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onUiLangChange(lang)}
                className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:text-black ${
                  uiLang === lang ? 'text-black border-b border-black' : 'text-zinc-400'
                }`}
              >
                {lang === 'zh' ? 'ZH' : 'EN'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 md:gap-10 border-l border-zinc-100 pl-8 md:pl-12 h-10">
            <button 
              onClick={handleKeyConfig}
              className={`flex items-center gap-4 group transition-all ${!isEnvReady ? 'opacity-50 cursor-wait' : ''}`}
              title={isEnvReady ? "Configure API Key" : "Environment Loading..."}
            >
              <div className="text-right flex flex-col items-end hidden sm:flex">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500">{t.status}</span>
                <span className={`text-[9px] font-bold ${hasKey ? 'text-black' : 'text-zinc-400 animate-pulse'}`}>
                  {hasKey ? t.connected : t.unset}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center transition-all group-hover:border-black ${hasKey ? 'bg-black border-black shadow-lg shadow-black/10' : 'bg-transparent'}`}>
                 <svg className={`w-4 h-4 ${hasKey ? 'text-white' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                 </svg>
              </div>
            </button>

            <button 
              onClick={onToggleSidebar}
              className="group flex items-center gap-4 transition-all"
            >
              <div className="text-right flex flex-col items-end hidden sm:flex">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500">{t.history}</span>
                <span className="text-[9px] font-bold text-black mt-0.5">{historyCount} {t.items}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-black transition-colors">
                 <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
