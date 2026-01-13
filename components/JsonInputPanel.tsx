
import React from 'react';

interface JsonInputPanelProps {
  value: string;
  onChange: (val: string) => void;
  error: string | null;
  t: any;
}

const JsonInputPanel: React.FC<JsonInputPanelProps> = ({ value, onChange, error, t }) => {
  return (
    <div className="flex-1 flex flex-col group relative h-full">
      <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={() => onChange('')}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 hover:text-black transition-colors py-2 border-b border-zinc-200 hover:border-black"
        >
          {t.clear}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`flex-1 w-full py-6 font-mono text-[14px] border-0 transition-all outline-none leading-[2.2] resize-none scrollbar-hide bg-transparent placeholder-zinc-200 ${
          error ? 'text-red-500' : 'text-black'
        }`}
        placeholder={t.placeholder}
      />
      
      {error && (
        <div className="absolute bottom-4 left-0 right-0 p-8 bg-black text-white rounded-sm flex items-center justify-between animate-reveal shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{error}</span>
          </div>
          <button onClick={() => onChange('')} className="text-[10px] opacity-60 hover:opacity-100 uppercase tracking-widest font-black">X</button>
        </div>
      )}
    </div>
  );
};

export default JsonInputPanel;
