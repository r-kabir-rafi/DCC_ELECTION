'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import boundaries from '@/data/boundaries.sample.geojson';
import { Search } from 'lucide-react';

export default function SearchBox({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  const { setSelectedConstituency } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string, name: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const features = boundaries.features || [];
    const matched = features
      .filter((f: any) => !zoneFilter || f.properties.zone === zoneFilter)
      .map((f: any) => ({
        id: f.properties.id,
        name: f.properties.name
      }))
      .filter((c: any) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase())
      );

    setResults(matched.slice(0, 6));
    setActiveIndex(-1);
  }, [query, zoneFilter]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setResults([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectResult = useCallback((id: string) => {
    setSelectedConstituency(id);
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
  }, [setSelectedConstituency]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectResult(results[activeIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setResults([]);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [results, activeIndex, selectResult]);

  return (
    <div className="absolute top-6 left-6 z-[400] w-[calc(100vw-3rem)] max-w-sm md:max-w-md" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-xl leading-5 bg-white shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all focus:shadow-lg dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-indigo-400"
          placeholder="Search constituency or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0) setQuery(query);
          }}
        />
      </div>
      {results.length > 0 && (
        <div className="mt-2 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden backdrop-blur-md bg-white/95 animate-fade-in dark:bg-slate-800/95 dark:border-slate-700">
          {results.map((r, index) => (
            <button
              key={r.id}
              className={`w-full text-left px-5 py-3 text-sm transition-colors border-b border-gray-50 last:border-b-0 flex items-center justify-between dark:border-slate-700/50 ${index === activeIndex
                  ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 dark:text-gray-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-200'
                }`}
              onClick={() => selectResult(r.id)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{r.id}</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{r.name}</span>
              </div>
              {index === activeIndex && (
                <span className="text-xs text-indigo-400 dark:text-indigo-400">↵</span>
              )}
            </button>
          ))}
          <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              ↑↓ navigate • Enter select • Esc close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
