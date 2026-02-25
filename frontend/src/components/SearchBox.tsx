'use client';
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import boundaries from '@/data/boundaries.sample.geojson';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const { setSelectedConstituency } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{id: string, name: string}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    
    const features = boundaries.features || [];
    const matched = features
      .map((f: any) => ({
        id: f.properties.id,
        name: f.properties.name
      }))
      .filter((c: any) => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.id.toLowerCase().includes(query.toLowerCase())
      );
      
    setResults(matched.slice(0, 5));
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-6 left-6 z-[400] w-80 md:w-96" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-xl leading-5 bg-white shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all focus:shadow-lg"
          placeholder="Search constituency or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length > 0) setQuery(query); // Trigger re-render if needed
          }}
        />
      </div>
      {results.length > 0 && (
        <div className="mt-2 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden backdrop-blur-md bg-white/95">
          {results.map((r) => (
            <button
              key={r.id}
              className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors border-b border-gray-50 last:border-b-0 flex items-center justify-between"
              onClick={() => {
                setSelectedConstituency(r.id);
                setQuery('');
                setResults([]);
              }}
            >
              <div>
                <span className="font-bold text-gray-900">{r.id}</span>
                <span className="ml-2 text-gray-600">{r.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
