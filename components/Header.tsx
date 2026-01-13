
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
    <header className="h-24 md:h-32 flex items-center px-8 md:px-16 border-b border-zinc-100 sticky top-0 glass z-40">
      <div className="max-w-[2000px] mx-auto w-full flex items-center justify-between relative">
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
              className={`flex items-center gap-4 group transition-all relative ${!isEnvReady ? 'opacity-50 cursor-wait' : ''}`}
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

        {/* Premium Manual Key Input Modal */}
        {showManualInput && (
          <div className="absolute right-0 top-full mt-6 w-[360px] glass border border-zinc-100 dropdown-shadow p-0 z-50 animate-reveal origin-top-right overflow-hidden rounded-sm">
            <div className="bg-zinc-50/50 p-8 border-b border-zinc-100">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.4em]">{t.apiKeyTitle}</h3>
                  <span className="text-[8px] font-medium text-zinc-400 tracking-tighter italic">GEMINI PRO / FLASH</span>
               </div>
               <p className="text-[9px] text-zinc-400 leading-relaxed uppercase tracking-widest opacity-60">
                 {uiLang === 'zh' ? '密钥将加密存储在您的浏览器本地' : 'KEY WILL BE STORED LOCALLY IN BROWSER'}
               </p>
            </div>
            
            <div className="p-8 space-y-8 bg-white">
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="password"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  placeholder={t.apiKeyPlaceholder}
                  className="w-full bg-transparent border-0 border-b border-zinc-100 py-4 text-sm font-mono outline-none focus:border-black transition-all placeholder:text-zinc-200"
                />
                <div className="absolute bottom-0 left-0 h-px bg-black w-0 group-focus-within:w-full transition-all duration-700"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={saveManualKey}
                  className="w-full bg-black text-white text-[10px] font-black uppercase tracking-[0.5em] py-5 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                  {t.saveKey}
                </button>
                <button
                   onClick={() => setShowManualInput(false)}
                   className="w-full py-4 text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-400 hover:text-black transition-colors border border-transparent hover:border-zinc-100"
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
