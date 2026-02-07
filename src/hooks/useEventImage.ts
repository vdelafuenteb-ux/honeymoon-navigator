import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'trip-image-cache';
const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCache(cache: Record<string, string>) {
  try {
    // Keep only last 30 images to avoid localStorage limits
    const entries = Object.entries(cache);
    if (entries.length > 30) {
      const trimmed = Object.fromEntries(entries.slice(-30));
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch { }
}

export const useEventImage = (prompt: string, enabled = true) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prompt || !enabled) return;

    const cache = loadCache();
    const cacheKey = prompt.slice(0, 100);

    if (cache[cacheKey]) {
      setImageUrl(cache[cacheKey]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    })
      .then(r => r.json())
      .then(data => {
        if (!cancelled && data.imageUrl) {
          setImageUrl(data.imageUrl);
          const c = loadCache();
          c[cacheKey] = data.imageUrl;
          saveCache(c);
        }
      })
      .catch(err => console.error('Image gen failed:', err))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [prompt, enabled]);

  return { imageUrl, loading };
};

// Batch hook for multiple prompts
export const useEventImages = (prompts: string[]) => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompts.length === 0) return;

    const cache = loadCache();
    const existing: Record<string, string> = {};
    const toGenerate: string[] = [];

    for (const p of prompts) {
      const key = p.slice(0, 100);
      if (cache[key]) existing[key] = cache[key];
      else toGenerate.push(p);
    }

    setImages(existing);
    if (toGenerate.length === 0) return;

    let cancelled = false;
    setLoading(true);

    // Generate up to 3 at a time to avoid overloading
    const generate = async () => {
      const batch = toGenerate.slice(0, 3);
      const results = await Promise.allSettled(
        batch.map(prompt =>
          fetch(GENERATE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ prompt }),
          }).then(r => r.json()).then(data => ({ prompt, imageUrl: data.imageUrl }))
        )
      );

      if (cancelled) return;
      const newCache = loadCache();
      const newImages: Record<string, string> = { ...existing };

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.imageUrl) {
          const key = r.value.prompt.slice(0, 100);
          newImages[key] = r.value.imageUrl;
          newCache[key] = r.value.imageUrl;
        }
      }

      saveCache(newCache);
      setImages(newImages);
      setLoading(false);
    };

    generate();
    return () => { cancelled = true; };
  }, [prompts.join('|')]);

  return { images, loading };
};
