'use client';

import { useEffect, useRef, useCallback, useId } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import { RotateCcw } from 'lucide-react';
import type { DccFeatureCollection, DccFeature, GeoFeatureProperties } from '@/lib/types';
import { getBounds, DHAKA_CENTER, DHAKA_ZOOM, LAYER_COLORS, HIGHLIGHT_COLOR } from '@/lib/geo';

interface MapShellProps {
    data: DccFeatureCollection;
    layerType?: string;
    center?: [number, number];
    zoom?: number;
    selectedId?: string | null;
    onFeatureClick?: (feature: DccFeature) => void;
    onFeatureHover?: (feature: DccFeature | null) => void;
    className?: string;
    children?: React.ReactNode;
}

/** Reset-view control inside the map */
function ResetControl({ data, center, zoom }: { data: DccFeatureCollection; center: [number, number]; zoom: number }) {
    const map = useMap();

    const handleReset = useCallback(() => {
        if (data.features.length > 0) {
            map.fitBounds(getBounds(data) as L.LatLngBoundsExpression, { padding: [30, 30] });
        } else {
            map.setView(center, zoom);
        }
    }, [map, data, center, zoom]);

    return (
        <div className="leaflet-top leaflet-right" style={{ marginTop: 10, marginRight: 10 }}>
            <div className="leaflet-control">
                <button
                    onClick={handleReset}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                    title="Reset view"
                    type="button"
                >
                    <RotateCcw size={14} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>
        </div>
    );
}

/** FitBounds helper — fits map to data on mount */
function FitBoundsOnMount({ data }: { data: DccFeatureCollection }) {
    const map = useMap();
    useEffect(() => {
        if (data.features.length > 0) {
            map.fitBounds(getBounds(data) as L.LatLngBoundsExpression, { padding: [30, 30] });
        }
    }, [map, data]);
    return null;
}

export default function MapShell({
    data,
    layerType = 'ward',
    center = DHAKA_CENTER,
    zoom = DHAKA_ZOOM,
    selectedId,
    onFeatureClick,
    onFeatureHover,
    className = '',
    children,
}: MapShellProps) {
    const mapId = useId();
    const geoJsonRef = useRef<L.GeoJSON | null>(null);

    const colors = LAYER_COLORS[layerType] || LAYER_COLORS.ward;

    const style = useCallback(
        (feature?: GeoJSON.Feature) => {
            if (!feature) return {};
            const props = feature.properties as GeoFeatureProperties;
            const isSelected = props.id === selectedId;

            return {
                fillColor: isSelected ? HIGHLIGHT_COLOR.fill : colors.fill,
                color: isSelected ? HIGHLIGHT_COLOR.stroke : colors.stroke,
                weight: isSelected ? 3 : 1.5,
                fillOpacity: isSelected ? HIGHLIGHT_COLOR.fillOpacity : colors.fillOpacity,
                opacity: 0.8,
            };
        },
        [selectedId, colors],
    );

    const onEachFeature = useCallback(
        (feature: GeoJSON.Feature, layer: Layer) => {
            const props = feature.properties as GeoFeatureProperties;

            layer.bindTooltip(props.name || props.id, {
                sticky: true,
                direction: 'top',
                className: 'map-tooltip',
            });

            layer.on({
                click: () => onFeatureClick?.(feature as DccFeature),
                mouseover: (e: LeafletMouseEvent) => {
                    onFeatureHover?.(feature as DccFeature);
                    const l = e.target;
                    if (props.id !== selectedId) {
                        l.setStyle({ fillOpacity: colors.fillOpacity + 0.15, weight: 2.5 });
                    }
                },
                mouseout: (e: LeafletMouseEvent) => {
                    onFeatureHover?.(null);
                    const l = e.target;
                    if (props.id !== selectedId) {
                        l.setStyle({ fillOpacity: colors.fillOpacity, weight: 1.5 });
                    }
                },
            });
        },
        [onFeatureClick, onFeatureHover, selectedId, colors],
    );


    if (data.features.length === 0) {
        return (
            <div className={`flex items-center justify-center bg-gray-50 dark:bg-slate-800 ${className}`}>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No boundary data available</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">GeoJSON not loaded or empty</p>
                </div>
            </div>
        );
    }

    return (
        <div key={mapId} className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                zoomControl={true}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON
                    key={`${layerType}-${selectedId}-${data.features.length}`}
                    ref={geoJsonRef as React.Ref<L.GeoJSON>}
                    data={data}
                    style={style}
                    onEachFeature={onEachFeature}
                />
                <FitBoundsOnMount data={data} />
                <ResetControl data={data} center={center} zoom={zoom} />
                {children}
            </MapContainer>
        </div>
    );
}
