'use client';

import { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import type { FeatureGroup as LFeatureGroup } from 'leaflet';
import L from 'leaflet';
import { Download, Upload, CheckCircle, AlertTriangle, Trash2, ZoomIn } from 'lucide-react';
import { validateGeoJSON, DHAKA_CENTER, getFeatureBounds } from '@/lib/geo';
import type { DccFeature, ValidationResult } from '@/lib/types';

interface WardFeature {
    type: 'Feature';
    properties: {
        ward_no?: number;
        ward_name?: string;
        name?: string;
        city?: 'DNCC' | 'DSCC';
        thana?: string;
    };
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

interface WardCollection {
    type: 'FeatureCollection';
    features: WardFeature[];
}

export default function WardEditorPage() {
    const [wards, setWards] = useState<WardFeature[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [cityFilter, setCityFilter] = useState<'DNCC' | 'DSCC'>('DNCC');
    const [validation, setValidation] = useState<ValidationResult | null>(null);
    const [showValidation, setShowValidation] = useState(false);

    // Form state
    const [formWardNo, setFormWardNo] = useState('');
    const [formName, setFormName] = useState('');
    const [formCity, setFormCity] = useState<'DNCC' | 'DSCC'>('DNCC');
    const [formThana, setFormThana] = useState('');

    const mapRef = useRef<L.Map | null>(null);
    const featureGroupRef = useRef<LFeatureGroup | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync form when selection changes (derived, not effect)
    const syncFormToSelection = useCallback((idx: number | null) => {
        setSelectedIdx(idx);
        if (idx !== null && wards[idx]) {
            const w = wards[idx];
            setFormWardNo(String(w.properties.ward_no ?? ''));
            setFormName(w.properties.ward_name || w.properties.name || '');
            setFormCity((w.properties.city as 'DNCC' | 'DSCC') || 'DNCC');
            setFormThana(w.properties.thana || '');
        } else {
            setFormWardNo('');
            setFormName('');
            setFormCity(cityFilter);
            setFormThana('');
        }
    }, [wards, cityFilter]);

    const handleCreated = useCallback((e: L.DrawEvents.Created) => {
        const layer = e.layer;
        const geojson = (layer as L.Polygon).toGeoJSON();

        const newWard: WardFeature = {
            type: 'Feature',
            properties: {
                ward_no: undefined,
                ward_name: '',
                city: cityFilter,
                thana: '',
            },
            geometry: geojson.geometry as GeoJSON.Polygon,
        };

        setWards(prev => {
            const next = [...prev, newWard];
            // Sync form to the new ward
            setTimeout(() => syncFormToSelection(next.length - 1), 0);
            return next;
        });

        // Remove from the draw layer (we manage features ourselves)
        if (featureGroupRef.current) {
            featureGroupRef.current.removeLayer(layer);
        }
    }, [cityFilter, syncFormToSelection]);

    const applyForm = useCallback(() => {
        if (selectedIdx === null) return;
        setWards(prev => {
            const updated = [...prev];
            updated[selectedIdx] = {
                ...updated[selectedIdx],
                properties: {
                    ...updated[selectedIdx].properties,
                    ward_no: formWardNo ? parseInt(formWardNo, 10) : undefined,
                    ward_name: formName,
                    name: formName,
                    city: formCity,
                    thana: formThana,
                },
            };
            return updated;
        });
    }, [selectedIdx, formWardNo, formName, formCity, formThana]);

    const deleteSelected = useCallback(() => {
        if (selectedIdx === null) return;
        setWards(prev => prev.filter((_, i) => i !== selectedIdx));
        syncFormToSelection(null);
    }, [selectedIdx, syncFormToSelection]);

    const zoomToWard = useCallback((idx: number) => {
        if (!mapRef.current || !wards[idx]) return;
        const bounds = getFeatureBounds(wards[idx] as DccFeature);
        mapRef.current.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50] });
        syncFormToSelection(idx);
    }, [wards, syncFormToSelection]);

    // Import GeoJSON
    const handleImport = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
                    setWards(data.features as WardFeature[]);
                    syncFormToSelection(null);
                } else {
                    alert('Invalid GeoJSON: must be a FeatureCollection');
                }
            } catch {
                alert('Failed to parse JSON file');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }, [syncFormToSelection]);

    // Export GeoJSON
    const handleExport = useCallback(() => {
        const cityWards = wards.filter(w => w.properties.city === cityFilter);
        const fc: WardCollection = {
            type: 'FeatureCollection',
            features: cityWards,
        };

        const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wards.${cityFilter.toLowerCase()}.geojson`;
        a.click();
        URL.revokeObjectURL(url);
    }, [wards, cityFilter]);

    // Validate
    const handleValidate = useCallback(() => {
        const cityWards = wards.filter(w => w.properties.city === cityFilter);
        const fc: WardCollection = { type: 'FeatureCollection', features: cityWards };
        const result = validateGeoJSON(fc);
        setValidation(result);
        setShowValidation(true);
    }, [wards, cityFilter]);

    const filteredWards = wards.filter(w => w.properties.city === cityFilter);

    return (
        <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-gray-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Ward Editor</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Draw polygons manually to create ward boundaries. No automated extraction.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={cityFilter}
                        onChange={e => { setCityFilter(e.target.value as 'DNCC' | 'DSCC'); syncFormToSelection(null); }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-slate-800 dark:text-gray-200"
                    >
                        <option value="DNCC">DNCC</option>
                        <option value="DSCC">DSCC</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Map */}
                <div className="flex-1">
                    <MapContainer
                        center={DHAKA_CENTER}
                        zoom={12}
                        className="h-full w-full"
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; OSM'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FeatureGroup ref={featureGroupRef as React.Ref<LFeatureGroup>}>
                            <EditControl
                                position="topleft"
                                onCreated={handleCreated}
                                draw={{
                                    polygon: { shapeOptions: { color: '#6366f1', fillOpacity: 0.3 } },
                                    polyline: false,
                                    rectangle: false,
                                    circle: false,
                                    circlemarker: false,
                                    marker: false,
                                }}
                                edit={{ edit: false, remove: false }}
                            />
                        </FeatureGroup>

                        {/* Render existing wards */}
                        {wards.length > 0 && (
                            <GeoJSON
                                key={`wards-${wards.length}-${selectedIdx}`}
                                data={{ type: 'FeatureCollection', features: wards } as GeoJSON.FeatureCollection}
                                style={(feature) => {
                                    const idx = wards.findIndex(w => w.properties.ward_no === feature?.properties?.ward_no && w.properties.city === feature?.properties?.city);
                                    const isSelected = idx === selectedIdx;
                                    const isCity = (feature?.properties?.city || '') === cityFilter;
                                    return {
                                        fillColor: isSelected ? '#ef4444' : isCity ? '#10b981' : '#94a3b8',
                                        color: isSelected ? '#dc2626' : isCity ? '#059669' : '#64748b',
                                        weight: isSelected ? 3 : 1.5,
                                        fillOpacity: isSelected ? 0.4 : isCity ? 0.25 : 0.1,
                                    };
                                }}
                                onEachFeature={(feature, layer) => {
                                    const idx = wards.findIndex(w => w.properties.ward_no === feature?.properties?.ward_no && w.properties.city === feature?.properties?.city);
                                    layer.on('click', () => syncFormToSelection(idx >= 0 ? idx : null));
                                    const name = feature.properties?.ward_name || feature.properties?.name || `Ward ${feature.properties?.ward_no || '?'}`;
                                    layer.bindTooltip(name, { sticky: true });
                                }}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Side panel */}
                <div className="flex w-80 flex-col border-l border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
                    {/* Actions */}
                    <div className="flex gap-1.5 border-b border-gray-200 p-3 dark:border-white/10">
                        <input ref={fileInputRef} type="file" accept=".geojson,.json" onChange={handleFileChange} className="hidden" />
                        <button onClick={handleImport} className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700">
                            <Upload size={12} /> Import
                        </button>
                        <button onClick={handleExport} className="flex items-center gap-1 rounded-lg bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">
                            <Download size={12} /> Export {cityFilter}
                        </button>
                        <button onClick={handleValidate} className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                            <CheckCircle size={12} /> Validate
                        </button>
                    </div>

                    {/* Validation results */}
                    {showValidation && validation && (
                        <div className={`border-b p-3 ${validation.valid ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-xs font-medium ${validation.valid ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                                    {validation.valid ? '✓ Valid GeoJSON' : `✗ ${validation.errors.length} error(s)`}
                                </p>
                                <button onClick={() => setShowValidation(false)} className="text-xs text-gray-400">✕</button>
                            </div>
                            {validation.errors.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                    {validation.errors.slice(0, 5).map((err, i) => (
                                        <li key={i} className="flex items-start gap-1 text-[10px] text-red-600 dark:text-red-400">
                                            <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" /> {err}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {validation.warnings.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                    {validation.warnings.slice(0, 3).map((w, i) => (
                                        <li key={i} className="text-[10px] text-amber-600 dark:text-amber-400">⚠ {w}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Properties form */}
                    <div className="border-b border-gray-200 p-3 dark:border-white/10">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                            {selectedIdx !== null ? 'Edit Ward Properties' : 'Select a ward or draw a new polygon'}
                        </p>
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Ward No</label>
                                <input
                                    type="number"
                                    value={formWardNo}
                                    onChange={e => setFormWardNo(e.target.value)}
                                    disabled={selectedIdx === null}
                                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm disabled:opacity-40 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Ward Name</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    disabled={selectedIdx === null}
                                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm disabled:opacity-40 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">City</label>
                                <select
                                    value={formCity}
                                    onChange={e => setFormCity(e.target.value as 'DNCC' | 'DSCC')}
                                    disabled={selectedIdx === null}
                                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm disabled:opacity-40 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200"
                                >
                                    <option value="DNCC">DNCC</option>
                                    <option value="DSCC">DSCC</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Thana (optional)</label>
                                <input
                                    type="text"
                                    value={formThana}
                                    onChange={e => setFormThana(e.target.value)}
                                    disabled={selectedIdx === null}
                                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm disabled:opacity-40 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200"
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={applyForm}
                                    disabled={selectedIdx === null}
                                    className="flex-1 rounded-md bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={deleteSelected}
                                    disabled={selectedIdx === null}
                                    className="rounded-md bg-red-100 px-2 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-40 dark:bg-red-900/30 dark:text-red-400"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ward list */}
                    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {cityFilter} Wards ({filteredWards.length})
                        </p>
                        {filteredWards.length === 0 && (
                            <p className="py-4 text-center text-xs text-gray-400">
                                No wards yet. Draw polygons on the map or import a GeoJSON file.
                            </p>
                        )}
                        {filteredWards.map((ward) => {
                            const globalIdx = wards.indexOf(ward);
                            const isSelected = globalIdx === selectedIdx;
                            return (
                                <button
                                    key={globalIdx}
                                    onClick={() => zoomToWard(globalIdx)}
                                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${isSelected
                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <span className="truncate">
                                        {ward.properties.ward_no !== undefined ? `#${ward.properties.ward_no} ` : ''}
                                        {ward.properties.ward_name || ward.properties.name || 'Unnamed'}
                                    </span>
                                    <ZoomIn size={12} className="flex-shrink-0 text-gray-400" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
