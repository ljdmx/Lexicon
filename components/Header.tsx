
import React, { useState, useEffect, useRef } from 'react';
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
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKeyStatus = async () => {
      const envKey = process.env.API_KEY;
      if (envKey && envKey !== 'undefined' && envKey.length > 5) {
        setHasKey(true);
        setIsEnvReady(true);
        return;
      }

      const localKey = localStorage.getItem('lexicon_manual_api_key');
      if (localKey && localKey.length > 5) {
        setHasKey(true);
        setIsEnvReady(true);
        return;
      }

      if (typeof window !== 'undefined') {
        if (window.aistudio) {
          setIsEnvReady(true);
          try {
            const selected = await window.aistudio.hasSelectedApiKey();
            setHasKey(selected);
          } catch (e) {
            console.debug("Bridge active but check failed:", e);
          }
        } else {
          setIsEnvReady(true);
        }
      }
    };
    
    checkKeyStatus();
    const interval = setInterval(checkKeyStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyConfig = async () => {
    if (typeof window !== 'undefined' && window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Failed to open key selection dialog:", e);
      }
    } else {
      setShowManualInput(!showManualInput);
      if (!showManualInput) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  };

  const saveManualKey = () => {
    if (manualKey.trim().length > 5) {
      localStorage.setItem('lexicon_manual_api_key', manualKey.trim());
      setHasKey(true);
      setShowManualInput(false);
    }
  };

  return (
    <header className="h-20 md:h-32 flex items-center px-5 md:px-16 border-b border-zinc-50 sticky top-0 glass z-40">
      <div className="max-w-[2000px] mx-auto w-full flex items-center justify-between">
        {/* Brand Group */}
        <div className="flex items-center">
          <div className="text-lg md:text-2xl font-bold tracking-[-0.08em] flex items-center gap-1 select-none">
            LEXICON<span className="font-extralight text-zinc-300 text-[10px] md:text-lg">®</span>
          </div>
          <div className="hidden xl:flex flex-col border-l border-zinc-200 pl-8 h-8 justify-center">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.5em]">{t.subtitle}</span>
          </div>
        </div>

        {/* Global Action Group: Prevents overlap by grouping right-side elements */}
        <div className="flex items-center gap-2 md:gap-16">
          {/* UI Language Toggles: Minimalist & compact for mobile */}
          <div className="flex gap-2 md:gap-8 mr-1 md:mr-0 items-center">
            {(['zh', 'en'] as UILang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onUiLangChange(lang)}
                className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all py-2 px-1 ${
                  uiLang === lang ? 'text-black border-b border-black' : 'text-zinc-200 hover:text-zinc-400'
                }`}
              >
                {lang === 'zh' ? 'ZH' : 'EN'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-10 md:border-l border-zinc-100 md:pl-12 h-10">
            {/* Status & Key Toggle */}
            <button 
              onClick={handleKeyConfig}
              className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-zinc-100 flex items-center justify-center transition-all hover:border-black active:scale-90"
            >
               <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${hasKey ? 'text-black' : 'text-zinc-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
               </svg>
            </button>

            {/* Archive / History */}
            <button 
              onClick={onToggleSidebar}
              className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-zinc-100 flex items-center justify-center hover:border-black transition-all active:scale-90 relative"
            >
               <div className="w-1 h-1 bg-black rounded-full"></div>
               {historyCount > 0 && (
                 <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[7px] flex items-center justify-center rounded-full font-black border-2 border-white">
                   {historyCount}
                 </div>
               )}
            </button>
          </div>
        </div>

        {/* Configuration Overlay */}
        {showManualInput && (
          <div className="absolute right-0 top-full mt-4 w-[calc(100vw-40px)] md:w-[380px] glass border border-zinc-100 shadow-2xl z-50 animate-reveal origin-top-right rounded-sm overflow-hidden">
            <div className="p-8 space-y-8 bg-white">
               <div>
                  <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.4em] mb-2">{t.apiKeyTitle}</h3>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest opacity-60">
                    {uiLang === 'zh' ? '密钥将加密存储在您的浏览器本地' : 'KEY WILL BE STORED LOCALLY'}
                  </p>
               </div>

              <input
                ref={inputRef}
                type="password"
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full bg-transparent border-0 border-b border-zinc-100 py-4 text-sm font-mono outline-none focus:border-black transition-all placeholder:text-zinc-100"
              />

              <div className="flex flex-col gap-2">
                <button
                  onClick={saveManualKey}
                  className="w-full bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] py-5 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                  {t.saveKey}
                </button>
                <button
                   onClick={() => setShowManualInput(false)}
                   className="w-full py-4 text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-300 hover:text-black transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
