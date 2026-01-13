
import React, { useState, useEffect } from 'react';

interface JsonOutputPanelProps {
  value: string;
  isLoading: boolean;
  t: any;
}

const JsonNode: React.FC<{ name: string | null, value: any, depth: number }> = ({ name, value, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isObject = value !== null && typeof value === 'object';
  const entries = isObject ? Object.entries(value) : null;
  const isArray = Array.isArray(value);

  return (
    <div className={`font-mono text-sm relative ${depth > 0 ? 'ml-12' : ''}`}>
      {depth > 0 && isObject && isOpen && <div className="absolute left-1.5 top-0 bottom-0 w-px bg-zinc-100" />}
      
      <div 
        className="flex items-center gap-4 group cursor-pointer py-3 transition-all hover:bg-zinc-50 rounded-sm px-2 -ml-2" 
        onClick={() => isObject && setIsOpen(!isOpen)}
      >
        {isObject ? (
          <span className={`w-4 h-4 flex items-center justify-center transition-transform text-zinc-400 group-hover:text-black ${isOpen ? 'rotate-90' : ''}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        ) : (
          <span className="w-4 h-4" />
        )}
        
        {name && <span className="text-zinc-500 font-semibold tracking-tight">"{name}": </span>}
        
        {!isObject ? (
          <span className={`${typeof value === 'string' ? 'text-black' : 'text-zinc-600 font-medium'}`}>
            {typeof value === 'string' ? `"${value}"` : String(value)}
            {depth > 0 ? <span className="text-zinc-300">,</span> : ''}
          </span>
        ) : (
          <span className="text-zinc-400 font-medium">
            {isArray ? '[' : '{'}
            {!isOpen && <span className="mx-3 text-zinc-300 tracking-[0.4em] text-[10px]">•••</span>}
            {!isOpen && (isArray ? ']' : '}')}
          </span>
        )}
      </div>

      {isObject && isOpen && (entries?.length ?? 0) > 0 && (
        <div className="relative">
          <div className="space-y-0.5">
            {entries?.map(([k, v], idx) => (
              <JsonNode key={k} name={isArray ? null : k} value={v} depth={depth + 1} />
            ))}
          </div>
          <div className="text-zinc-400 py-3 ml-12 font-medium">
            {isArray ? ']' : '}'}
            {depth > 0 ? <span className="text-zinc-300">,</span> : ''}
          </div>
        </div>
      )}
    </div>
  );
};

const HybridView: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(<[^>]+>)/g);
  return (
    <pre className="whitespace-pre-wrap font-mono text-[14px] leading-[2.4] text-black px-4">
      {parts.map((part, i) => {
        if (part.startsWith('<') && part.endsWith('>')) {
          return <span key={i} className="text-zinc-400 font-bold tracking-tight">{part}</span>;
        }
        return <span key={i} className="text-zinc-800">{part}</span>;
      })}
    </pre>
  );
};

const JsonOutputPanel: React.FC<JsonOutputPanelProps> = ({ value, isLoading, t }) => {
  const [copied, setCopied] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isJson, setIsJson] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        setParsedData(parsed);
        setIsJson(true);
      } catch (e) {
        setParsedData(null);
        setIsJson(false);
      }
    } else {
      setParsedData(null);
      setIsJson(false);
    }
  }, [value]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col group relative h-full">
      {value && !isLoading && (
        <div className="absolute top-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={handleCopy}
            className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all py-3 border-b border-zinc-200 hover:border-black ${
              copied ? 'text-black' : 'text-zinc-400 hover:text-black'
            }`}
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}

      <div className={`flex-1 w-full transition-all duration-700 overflow-auto scrollbar-hide py-4 ${isLoading ? 'opacity-0 translate-y-8 filter blur-lg' : 'opacity-100 translate-y-0 filter blur-0'}`}>
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-16">
            <div className="w-24 h-px bg-zinc-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-black w-1/3 animate-[progress_1.2s_infinite]"></div>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.8em]">{t.translating}</p>
          </div>
        ) : isJson ? (
          <div className="animate-reveal">
            <JsonNode name={null} value={parsedData} depth={0} />
          </div>
        ) : value ? (
          <div className="animate-reveal">
             <HybridView content={value} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 pointer-events-none select-none">
             <div className="w-px h-24 bg-black mb-16"></div>
            <p className="text-[10px] font-bold uppercase tracking-[1em] text-black">{t.result}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default JsonOutputPanel;
