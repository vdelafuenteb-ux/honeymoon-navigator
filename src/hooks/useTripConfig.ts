import { useState, useCallback, useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

export interface TripConfig {
  startDate: string | null; // ISO date
  endDate: string | null;
  coupleNames: [string, string];
}

const STORAGE_KEY = 'trip-config';

function loadConfig(): TripConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { startDate: null, endDate: null, coupleNames: ['', ''] };
}

export const useTripConfig = () => {
  const [config, setConfigState] = useState<TripConfig>(loadConfig);

  const setConfig = useCallback((updates: Partial<TripConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isConfigured = !!(config.startDate && config.endDate);

  const totalDays = useMemo(() => {
    if (!config.startDate || !config.endDate) return 0;
    return differenceInDays(parseISO(config.endDate), parseISO(config.startDate)) + 1;
  }, [config.startDate, config.endDate]);

  const daysRemaining = useMemo(() => {
    if (!config.startDate) return 0;
    const diff = differenceInDays(parseISO(config.startDate), new Date());
    return Math.max(0, diff);
  }, [config.startDate]);

  return { config, setConfig, isConfigured, totalDays, daysRemaining };
};
