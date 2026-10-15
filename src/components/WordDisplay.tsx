import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface WordDisplayProps {
  word: string;
  onGenerate: () => void;
}

export function WordDisplay({ word, onGenerate }: WordDisplayProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onGenerate();
    setTimeout(() => setAnimating(false), 200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-10 sm:py-16 px-4">
      {/* Current Random Word */}
      <div className="min-h-[140px] sm:min-h-[170px] flex items-center justify-center">
        <h2
          id="current-word"
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 transition-all duration-200 select-all ${
            animating
              ? 'opacity-40 scale-95 translate-y-1'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {word}
        </h2>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        id="generate-word-btn"
        onClick={handleClick}
        className="mt-6 sm:mt-8 group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-base shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/25 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
        <span>Generate New Word</span>
      </button>
    </div>
  );
}
