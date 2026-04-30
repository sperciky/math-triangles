'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppProgress, LevelProgress } from '../math/types';

const STORAGE_KEY = 'math-triangles-progress';
const TOTAL_LEVELS = 5;

const defaultLevelProgress = (level: number): LevelProgress => ({
  level,
  completed: false,
  score: 0,
  maxScore: 0,
  attempts: 0,
});

const defaultProgress = (): AppProgress => ({
  levels: Object.fromEntries(
    Array.from({ length: TOTAL_LEVELS }, (_, i) => [i + 1, defaultLevelProgress(i + 1)])
  ),
  finalTestCompleted: false,
  finalTestScore: 0,
  finalTestMaxScore: 0,
});

export function useProgress() {
  const [progress, setProgress] = useState<AppProgress>(defaultProgress());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppProgress;
        // Merge in case new levels were added
        const merged = defaultProgress();
        merged.levels = { ...merged.levels, ...parsed.levels };
        merged.finalTestCompleted = parsed.finalTestCompleted ?? false;
        merged.finalTestScore = parsed.finalTestScore ?? 0;
        merged.finalTestMaxScore = parsed.finalTestMaxScore ?? 0;
        setProgress(merged);
      }
    } catch {
      // corrupted storage — reset
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: AppProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // quota exceeded — silently ignore
    }
  }, []);

  const completeLevel = useCallback(
    (level: number, score: number, maxScore: number) => {
      setProgress((prev) => {
        const existing = prev.levels[level] ?? defaultLevelProgress(level);
        const next: AppProgress = {
          ...prev,
          levels: {
            ...prev.levels,
            [level]: {
              ...existing,
              completed: true,
              score: Math.max(existing.score, score),
              maxScore,
              attempts: existing.attempts + 1,
            },
          },
        };
        save(next);
        return next;
      });
    },
    [save]
  );

  const completeTest = useCallback(
    (score: number, maxScore: number) => {
      setProgress((prev) => {
        const next: AppProgress = {
          ...prev,
          finalTestCompleted: true,
          finalTestScore: Math.max(prev.finalTestScore, score),
          finalTestMaxScore: maxScore,
        };
        save(next);
        return next;
      });
    },
    [save]
  );

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    save(fresh);
  }, [save]);

  const isLevelUnlocked = useCallback(
    (level: number): boolean => {
      if (level === 1) return true;
      return progress.levels[level - 1]?.completed ?? false;
    },
    [progress]
  );

  const isTestUnlocked = useCallback((): boolean => {
    return progress.levels[TOTAL_LEVELS]?.completed ?? false;
  }, [progress]);

  const totalScore = Object.values(progress.levels).reduce((s, l) => s + l.score, 0);
  const totalMaxScore = Object.values(progress.levels).reduce((s, l) => s + l.maxScore, 0);
  const levelsCompleted = Object.values(progress.levels).filter((l) => l.completed).length;

  return {
    progress,
    loaded,
    completeLevel,
    completeTest,
    resetProgress,
    isLevelUnlocked,
    isTestUnlocked,
    totalScore,
    totalMaxScore,
    levelsCompleted,
    totalLevels: TOTAL_LEVELS,
  };
}
