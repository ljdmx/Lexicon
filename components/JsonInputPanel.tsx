
import React from 'react';

interface JsonInputPanelProps {
  value: string;
  onChange: (val: string) => void;
  error: string | null;
  t: any;
}

const JsonInputPanel: React.FC<JsonInputPanelProps> = ({ value, onChange, error, t }) => {
  return (
    <div className="flex-1 flex flex-col group relative w-full h-full">
      {/* Invisible Clear Action */}
      <div className="absolute top-0 right-0 z-10 opacity-0 lg:group-hover:opacity-100 transition-all">
        <button 
          onClick={() => onChange('')}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 hover:text-black transition-colors py-2 border-b border-zinc-200 hover:border-black"
        >
          {t.clear}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`flex-1 w-full py-4 md:py-8 font-mono text-[14px] border-0 transition-all outline-none leading-[2.2] md:leading-[2.6] resize-none scrollbar-hide bg-transparent placeholder-zinc-100 ${
          error ? 'text-red-500' : 'text-zinc-800 focus:text-black'
        }`}
        placeholder={t.placeholder}
        style={{ minHeight: '600px' }}
      />
      
      {error && (
        <div className="absolute bottom-8 left-0 right-0 p-6 md:p-10 bg-black text-white rounded-sm flex items-center justify-between animate-reveal shadow-2xl z-20">
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-left leading-relaxed">{error}</span>
          </div>
          <button onClick={() => onChange('')} className="text-[10px] px-3 opacity-40 hover:opacity-100 uppercase tracking-[0.3em] font-black shrink-0 transition-opacity">CLOSE</button>
        </div>
      )}
    </div>
  );
};

export default JsonInputPanel;
