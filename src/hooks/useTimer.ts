import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface UseTimerOptions {
  totalSeconds: number;
  onFinish?: () => void;
  onStart?: () => void;
}

export interface UseTimerReturn {
  remainingMs: number;
  displaySeconds: number;
  formattedTime: string;
  status: TimerStatus;
  progress: number; // 0 (start) -> 1 (complete)
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function formatTime(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function useTimer({
  totalSeconds,
  onFinish,
  onStart,
}: UseTimerOptions): UseTimerReturn {
  const totalMs = totalSeconds * 1000;
  const [remainingMs, setRemainingMs] = useState<number>(totalMs);
  const [status, setStatus] = useState<TimerStatus>('idle');

  // Refs to avoid stale closures in interval and listeners
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(totalMs);
  const intervalIdRef = useRef<number | null>(null);
  const onFinishRef = useRef(onFinish);
  const onStartRef = useRef(onStart);

  useEffect(() => {
    onFinishRef.current = onFinish;
    onStartRef.current = onStart;
  }, [onFinish, onStart]);

  // Keep ref synchronized with state
  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  const clearTimerInterval = useCallback(() => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const handleFinish = useCallback(() => {
    clearTimerInterval();
    endTimeRef.current = null;
    remainingMsRef.current = 0;
    setRemainingMs(0);
    setStatus('finished');
    if (onFinishRef.current) {
      onFinishRef.current();
    }
  }, [clearTimerInterval]);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const diff = endTimeRef.current - now;

    if (diff <= 0) {
      handleFinish();
    } else {
      remainingMsRef.current = diff;
      setRemainingMs(diff);
    }
  }, [handleFinish]);

  const start = useCallback(() => {
    clearTimerInterval();
    if (onStartRef.current) {
      onStartRef.current();
    }

    const currentRemaining = status === 'paused' ? remainingMsRef.current : totalMs;
    const targetEnd = Date.now() + currentRemaining;
    endTimeRef.current = targetEnd;

    setStatus('running');
    setRemainingMs(currentRemaining);
    remainingMsRef.current = currentRemaining;

    // Tick every 150ms for smooth updates and zero perceptible lag
    intervalIdRef.current = window.setInterval(tick, 150);
  }, [clearTimerInterval, status, totalMs, tick]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimerInterval();

    if (endTimeRef.current) {
      const exactRemaining = Math.max(0, endTimeRef.current - Date.now());
      remainingMsRef.current = exactRemaining;
      setRemainingMs(exactRemaining);
    }

    endTimeRef.current = null;
    setStatus('paused');
  }, [clearTimerInterval, status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    start();
  }, [start, status]);

  const reset = useCallback(() => {
    clearTimerInterval();
    endTimeRef.current = null;
    remainingMsRef.current = totalMs;
    setRemainingMs(totalMs);
    setStatus('idle');
  }, [clearTimerInterval, totalMs]);

  // Handle browser tab switching & visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'running' && endTimeRef.current) {
        const diff = endTimeRef.current - Date.now();
        if (diff <= 0) {
          handleFinish();
        } else {
          remainingMsRef.current = diff;
          setRemainingMs(diff);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleFinish, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  const displaySeconds = Math.ceil(remainingMs / 1000);
  const formattedTime = formatTime(displaySeconds);
  const progress = Math.min(1, Math.max(0, (totalMs - remainingMs) / totalMs));

  return {
    remainingMs,
    displaySeconds,
    formattedTime,
    status,
    progress,
    start,
    pause,
    resume,
    reset,
  };
}
