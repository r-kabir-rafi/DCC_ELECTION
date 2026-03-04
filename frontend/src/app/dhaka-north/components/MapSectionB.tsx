'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { DccFeature, CityCode } from '@/lib/types';
import { getWardsGeoJSON, getWardListItems, getThanaListItems, getConstituencyListItems } from '@/lib/data';
import SearchInput, { useSearch } from '@/components/common/SearchInput';
import GeoLegend from '@/components/common/GeoLegend';

const MapShell = dynamic(() => import('@/components/common/MapShell'), { ssr: false });

interface MapSectionBProps {
    city: CityCode;
    title: string;
    description: string;
}

type Tab = 'wards' | 'thanas' | 'constituencies';

export default function MapSectionB({ city, title, description }: MapSectionBProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('wards');
    const [search, setSearch] = useState('');

    const geoData = getWardsGeoJSON(city);
    const wardItems = getWardListItems(city);
    const thanaItems = getThanaListItems(city);
    const constituencyItems = getConstituencyListItems(city);

    const filteredWards = useSearch(wardItems, activeTab === 'wards' ? search : '', item => `${item.name} ${item.ward_no || ''} ${item.thana || ''}`);
    const filteredThanas = useSearch(thanaItems, activeTab === 'thanas' ? search : '', item => item.name);
    const filteredConstituencies = useSearch(constituencyItems, activeTab === 'constituencies' ? search : '', item => `${item.name} ${item.code || ''}`);

    const handleFeatureClick = useCallback((feature: DccFeature) => {
        setSelectedId(prev => (prev === feature.properties.id ? null : feature.properties.id));
    }, []);

    const selectedFeature = geoData.features.find(f => f.properties.id === selectedId);

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'wards', label: 'Wards', count: wardItems.length },
        { key: 'thanas', label: 'Thanas', count: thanaItems.length },
        { key: 'constituencies', label: 'Const.', count: constituencyItems.length },
    ];

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
                    {/* Map */}
                    <div className="h-[400px] lg:h-[550px]">
                        <MapShell
                            data={geoData}
                            layerType="ward"
                            selectedId={selectedId}
                            onFeatureClick={handleFeatureClick}
                            className="h-full"
                        />
                    </div>

                    {/* Panel */}
                    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:max-h-[550px]">
                        {/* Selected ward details */}
                        {selectedFeature ? (
                            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                                    {selectedFeature.properties.name}
                                </h3>
                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                                    {selectedFeature.properties.ward_no !== undefined && (
                                        <span>Ward #{selectedFeature.properties.ward_no}</span>
                                    )}
                                    {selectedFeature.properties.thana && (
                                        <span>· Thana: {selectedFeature.properties.thana}</span>
                                    )}
                                    <span>· {selectedFeature.properties.city}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                                >
                                    ✕ Deselect
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Click a ward polygon to see details
                            </p>
                        )}

                        {/* Tabs */}
                        <div className="flex rounded-lg bg-gray-100 p-0.5 dark:bg-slate-800">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveTab(tab.key); setSearch(''); }}
                                    className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${activeTab === tab.key
                                            ? 'bg-white text-gray-800 shadow-sm dark:bg-slate-700 dark:text-gray-100'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>

                        <SearchInput
                            placeholder={`Search ${activeTab}…`}
                            value={search}
                            onChange={setSearch}
                        />

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {activeTab === 'wards' && filteredWards.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => item.hasBoundary && setSelectedId(item.id === selectedId ? null : item.id)}
                                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${item.id === selectedId
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
                                            : item.hasBoundary
                                                ? 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    disabled={!item.hasBoundary}
                                >
                                    <span className="font-medium">
                                        {item.ward_no !== undefined && `#${item.ward_no} `}{item.name}
                                    </span>
                                    {item.thana && <span className="ml-1 text-xs text-gray-400">· {item.thana}</span>}
                                    {!item.hasBoundary && (
                                        <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            not mapped yet
                                        </span>
                                    )}
                                </button>
                            ))}

                            {activeTab === 'thanas' && filteredThanas.map(item => (
                                <div key={item.id} className="rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                                </div>
                            ))}

                            {activeTab === 'constituencies' && filteredConstituencies.map(item => (
                                <div key={item.id} className="rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="ml-2 text-xs text-gray-400">{item.code}</span>
                                </div>
                            ))}

                            {((activeTab === 'wards' && filteredWards.length === 0) ||
                                (activeTab === 'thanas' && filteredThanas.length === 0) ||
                                (activeTab === 'constituencies' && filteredConstituencies.length === 0)) && (
                                    <p className="py-4 text-center text-xs text-gray-400">No results</p>
                                )}
                        </div>

                        <GeoLegend entries={[
                            { label: 'Ward', type: 'ward' },
                            { label: 'Thana', type: 'thana' },
                            { label: 'Constituency', type: 'constituency' },
                        ]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
