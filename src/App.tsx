import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { WordDisplay } from './components/WordDisplay';
import { Timer } from './components/Timer';
import { getRandomWord } from './data/words';
import { useTimer } from './hooks/useTimer';
import { playChime } from './utils/audio';

const RESEARCH_SECONDS = 10 * 60; // 10 minutes
const SPEAKING_SECONDS = 4 * 60;  // 4 minutes
const MAX_RECENT_WORDS = 50;

export default function App() {
  // Word state initialized immediately with a random word
  const [recentWords, setRecentWords] = useState<string[]>(() => {
    const firstWord = getRandomWord([]);
    return [firstWord];
  });

  const currentWord = recentWords[recentWords.length - 1] || 'Resilience';

  // Handle generating a new word with FIFO history
  const handleGenerateWord = useCallback(() => {
    setRecentWords((prev) => {
      const nextWord = getRandomWord(prev);
      const updated = [...prev, nextWord];
      if (updated.length > MAX_RECENT_WORDS) {
        return updated.slice(updated.length - MAX_RECENT_WORDS);
      }
      return updated;
    });
  }, []);

  // Timers:
  // Forward declare timer controllers for mutual cross-pausing
  const researchTimer = useTimer({
    totalSeconds: RESEARCH_SECONDS,
    onStart: () => {
      // Auto-pause speaking timer if it's currently running
      speakingTimer.pause();
    },
    onFinish: () => {
      playChime('gentle');
    },
  });

  const speakingTimer = useTimer({
    totalSeconds: SPEAKING_SECONDS,
    onStart: () => {
      // Auto-pause research timer if it's currently running
      researchTimer.pause();
    },
    onFinish: () => {
      playChime('alert');
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/20">
      {/* Top Header */}
      <Header />

      {/* Main Single-Screen Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 pb-12">
        {/* Word Display Section */}
        <WordDisplay
          word={currentWord}
          onGenerate={handleGenerateWord}
        />

        {/* Timers Grid: Side by side on desktop (grid-cols-2), stacked on mobile (grid-cols-1) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-4">
          <Timer
            idPrefix="research-timer"
            label="Research"
            subtitle="Preparation Phase"
            timer={researchTimer}
            isSpeakingTimer={false}
          />
          <Timer
            idPrefix="speaking-timer"
            label="Speaking"
            subtitle="Practice Phase"
            timer={speakingTimer}
            isSpeakingTimer={true}
          />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-4xl mx-auto py-6 px-4 text-center text-xs text-slate-600 dark:text-slate-400">
        <p>10m Research • 4m Speaking • Built for NDA / CDS Interview Fluency</p>
      </footer>
    </div>
  );
}
