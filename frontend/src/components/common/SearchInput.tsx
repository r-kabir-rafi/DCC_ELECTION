'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SearchInput({
    placeholder = 'Search…',
    value: controlledValue,
    onChange,
    className = '',
}: SearchInputProps) {
    const [internalValue, setInternalValue] = useState('');
    const value = controlledValue ?? internalValue;

    const handleChange = (val: string) => {
        if (controlledValue === undefined) setInternalValue(val);
        onChange(val);
    };

    return (
        <div className={`relative ${className}`}>
            <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                value={value}
                onChange={e => handleChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => handleChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

/** Hook for filtering a list by search term */
export function useSearch<T>(
    items: T[],
    searchTerm: string,
    getSearchable: (item: T) => string,
): T[] {
    return useMemo(() => {
        if (!searchTerm.trim()) return items;
        const lower = searchTerm.toLowerCase();
        return items.filter(item => getSearchable(item).toLowerCase().includes(lower));
    }, [items, searchTerm, getSearchable]);
}
