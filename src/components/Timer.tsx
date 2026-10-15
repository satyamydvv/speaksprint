import { Play, Pause, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import type { UseTimerReturn } from '../hooks/useTimer';

interface TimerProps {
  idPrefix: string;
  label: string;
  subtitle: string;
  timer: UseTimerReturn;
  isSpeakingTimer?: boolean;
}

export function Timer({
  idPrefix,
  label,
  subtitle,
  timer,
  isSpeakingTimer = false,
}: TimerProps) {
  const {
    formattedTime,
    status,
    progress,
    start,
    pause,
    resume,
    reset,
  } = timer;

  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isFinished = status === 'finished';

  return (
    <div
      id={`${idPrefix}-card`}
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${
        isFinished
          ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10'
          : isRunning
          ? 'bg-white dark:bg-slate-900 border-blue-500/40 dark:border-blue-400/40 shadow-md shadow-blue-500/5'
          : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 shadow-xs'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            {subtitle}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {label}
          </h3>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5">
          {isRunning && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Running
            </span>
          )}
          {isPaused && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              Paused
            </span>
          )}
          {isFinished && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete
            </span>
          )}
          {status === 'idle' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Clock className="w-3 h-3" />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="py-4 sm:py-6 text-center">
        <div
          id={`${idPrefix}-display`}
          className={`timer-digits text-5xl sm:text-6xl font-bold tracking-tight transition-colors duration-200 ${
            isFinished
              ? 'text-blue-600 dark:text-blue-400'
              : isRunning
              ? 'text-slate-900 dark:text-white'
              : isPaused
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {formattedTime}
        </div>

        {/* Completion Notice */}
        {isFinished && (
          <div className="mt-2 text-sm font-semibold text-blue-700 dark:text-blue-300 animate-bounce">
            {isSpeakingTimer
              ? '🎉 Four minutes complete! Well spoken.'
              : '🔔 Ten minutes complete! Ready to speak.'}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-200 ${
            isFinished
              ? 'bg-emerald-500 w-full'
              : 'bg-blue-600 dark:bg-blue-500'
          }`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {status === 'idle' && (
          <button
            type="button"
            id={`${idPrefix}-start-btn`}
            onClick={start}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start</span>
          </button>
        )}

        {isRunning && (
          <>
            <button
              type="button"
              id={`${idPrefix}-pause-btn`}
              onClick={pause}
              className="flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
            <button
              type="button"
              id={`${idPrefix}-reset-btn`}
              onClick={reset}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-all duration-150 active:scale-95 cursor-pointer"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              type="button"
              id={`${idPrefix}-resume-btn`}
              onClick={resume}
              className="flex-1 max-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
            <button
              type="button"
              id={`${idPrefix}-reset-btn`}
              onClick={reset}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-all duration-150 active:scale-95 cursor-pointer"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}

        {isFinished && (
          <button
            type="button"
            id={`${idPrefix}-reset-btn`}
            onClick={reset}
            className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-sm transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Timer</span>
          </button>
        )}
      </div>
    </div>
  );
}
