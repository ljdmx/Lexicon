
import React, { useState, useEffect, useMemo } from 'react';
import { GeminiService } from './services/geminiService';
import { SUPPORTED_LANGUAGES, TranslationItem, UI_STRINGS, UILang } from './types';
import Header from './components/Header';
import JsonInputPanel from './components/JsonInputPanel';
import JsonOutputPanel from './components/JsonOutputPanel';
import HistorySidebar from './components/HistorySidebar';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>('{\n  "lexicon": {\n    "vision": "Structural perfection through minimalism.",\n    "capabilities": [\n      "AI Translation",\n      "Format Preservation",\n      "Zero Clutter"\n    ]\n  }\n}');
  const [outputContent, setOutputContent] = useState<string>('');
  const [targetLang, setTargetLang] = useState<string>(SUPPORTED_LANGUAGES[0].code);
  const [uiLang, setUiLang] = useState<UILang>('zh');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TranslationItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const t = useMemo(() => UI_STRINGS[uiLang], [uiLang]);

  useEffect(() => {
    const saved = localStorage.getItem('lexicon_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
    const savedLang = localStorage.getItem('lexicon_ui_lang') as UILang;
    if (savedLang) setUiLang(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('lexicon_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('lexicon_ui_lang', uiLang);
  }, [uiLang]);

  const handleTranslate = async () => {
    if (!inputContent.trim()) {
      setError(t.emptyInput);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await GeminiService.getInstance().translateContent(inputContent, targetLang);
      setOutputContent(result);
      
      const newItem: TranslationItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        inputJson: inputContent,
        outputJson: result,
        targetLanguage: targetLang
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 20));
    } catch (err: any) {
      const errCode = err.message;
      let displayError = t.errorGeneral;

      if (errCode === 'AUTH_REQUIRED') {
        displayError = t.errorAuth;
        if (window.aistudio?.openSelectKey) {
          setTimeout(() => window.aistudio.openSelectKey(), 500);
        }
      } else if (errCode === 'CONTENT_TOO_LARGE') {
        displayError = t.errorLimit;
      } else if (errCode === 'EMPTY_RESPONSE') {
        displayError = t.errorEmptyResponse;
      }

      setError(displayError);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        historyCount={history.length}
        uiLang={uiLang}
        onUiLangChange={setUiLang}
        t={t}
      />
      
      <main className="flex-1 max-w-[2000px] mx-auto w-full px-6 md:px-16 lg:px-24 py-8 md:py-16 flex flex-col">
        {/* Workspace Container: Enforced Vertical Depth */}
        <div className="flex flex-col lg:flex-row gap-16 md:gap-20 xl:gap-40 h-full flex-1 items-stretch">
          
          {/* Source Section: Enforced 600px depth */}
          <section className="flex-1 flex flex-col min-w-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between h-14 md:h-16 mb-4 md:mb-12 border-b border-zinc-50 pb-2">
              <div className="flex items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]">{t.source}</span>
              </div>
              
              <div className="flex items-center gap-6 md:gap-16">
                <LanguageSelector value={targetLang} onChange={setTargetLang} />
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-zinc-500 active:scale-95 disabled:opacity-20`}
                >
                  {isTranslating ? t.translating : t.translate}
                </button>
              </div>
            </div>
            
            {/* Rigid Layout Lock: 600px minimum height for the canvas */}
            <div className="flex-1 min-h-[600px] flex overflow-hidden">
              <JsonInputPanel 
                value={inputContent} 
                onChange={setInputContent} 
                error={error}
                t={t}
              />
            </div>
          </section>

          {/* Result Section: Mirror Height for Symmetry */}
          <section className="flex-1 flex flex-col min-w-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between h-14 md:h-16 mb-4 md:mb-12 border-b border-zinc-50 pb-2">
              <div className="flex items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]">{t.result}</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-[600px] flex overflow-hidden">
              <JsonOutputPanel 
                value={outputContent} 
                isLoading={isTranslating}
                t={t}
              />
            </div>
          </section>
        </div>
      </main>

      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        items={history}
        onSelect={(item) => {
          setInputContent(item.inputJson);
          setOutputContent(item.outputJson);
          setTargetLang(item.targetLanguage);
          setIsSidebarOpen(false);
        }}
        onClear={() => { setHistory([]); localStorage.removeItem('lexicon_history'); }}
        t={t}
      />

      <footer className="py-16 md:py-24 border-t border-zinc-50 mt-auto">
        <div className="max-w-[2000px] mx-auto px-10 md:px-24 flex flex-col md:flex-row items-center justify-between gap-8 opacity-10 grayscale text-center pointer-events-none">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-24 text-[9px] font-bold uppercase tracking-[1em]">
            <span className="text-black">{t.footer}</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="text-black">CORE.ENGINE.ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
