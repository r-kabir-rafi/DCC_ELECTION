'use client';

import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/store/useAppStore';
import { getLatestResult } from '@/lib/data';
import boundariesData from '@/data/boundaries.sample.geojson';
import { getPartyColor } from '@/lib/geo';

function MapController({ geoJsonData, zoneFilter }: { geoJsonData: any; zoneFilter?: 'DNCC' | 'DSCC' }) {
  const map = useMap();
  const { mode, selectedConstituency, setSelectedConstituency } = useAppStore();
  const geoJsonRef = useRef<L.GeoJSON>(null);

  const filteredData = useMemo(() => {
    if (!zoneFilter) return geoJsonData;
    return {
      ...geoJsonData,
      features: geoJsonData.features.filter((f: any) => f.properties.zone === zoneFilter)
    };
  }, [geoJsonData, zoneFilter]);

  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.clearLayers();
      geoJsonRef.current.addData(filteredData as any);
    }
  }, [mode, filteredData]);

  useEffect(() => {
    if (!selectedConstituency || !geoJsonRef.current) return;

    const layers = geoJsonRef.current.getLayers() as L.Path[];
    const targetLayer = layers.find((layer: any) => layer.feature.properties.id === selectedConstituency);

    if (targetLayer && typeof (targetLayer as any).getBounds === 'function') {
      const bounds = (targetLayer as any).getBounds();
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });

      layers.forEach((layer) => {
        const isActive = (layer as any).feature.properties.id === selectedConstituency;
        if (isActive) {
          (layer as any).setStyle({
            weight: 4,
            color: '#6366f1',
            dashArray: '',
            fillOpacity: 0.9
          });
          (layer as any).bringToFront();
        } else {
          geoJsonRef.current?.resetStyle(layer as any);
        }
      });
    }
    if (!targetLayer && zoneFilter) {
      setSelectedConstituency(null);
    }

  }, [selectedConstituency, map, setSelectedConstituency, zoneFilter]);

  const styleFeature = (feature: any) => {
    const defaultStyle = {
      fillColor: '#E5E7EB',
      weight: 1.5,
      opacity: 1,
      color: '#FFFFFF',
      dashArray: '3',
      fillOpacity: 0.7
    };

    if (!feature.properties) return defaultStyle;

    const result = getLatestResult(mode, feature.properties.id);
    if (!result) return defaultStyle;

    return {
      ...defaultStyle,
      fillColor: getPartyColor(result.winner_party),
      fillOpacity: 0.8,
      color: '#f8fafc',
      weight: 1.5,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      const result = getLatestResult(mode, feature.properties.id);
      const winnerText = result ? `<br/><span style="color:${getPartyColor(result.winner_party)}; font-weight:bold">${result.winner_party}</span>` : '<br/><span style="color:#9CA3AF">No data</span>';
      const tooltipContent = `<div class="text-center font-sans tracking-tight"><strong class="text-sm">${feature.properties.name}</strong>${winnerText}</div>`;
      layer.bindTooltip(tooltipContent, {
        sticky: true,
        className: 'custom-tooltip shadow-lg rounded-xl border-none',
        offset: [0, -5]
      });
    }

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        if (target.feature?.properties?.id !== useAppStore.getState().selectedConstituency) {
          target.setStyle({
            weight: 3,
            color: '#6366f1',
            dashArray: '',
            fillOpacity: 0.9
          });
          target.bringToFront();
        }
      },
      mouseout: (e) => {
        const target = e.target;
        if (target.feature?.properties?.id !== useAppStore.getState().selectedConstituency) {
          geoJsonRef.current?.resetStyle(target);
        }
      },
      click: (e) => {
        setSelectedConstituency(feature.properties.id);
      }
    });
  };

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={filteredData as any}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
}

export default function MapView({ zoneFilter }: { zoneFilter?: 'DNCC' | 'DSCC' }) {
  const center: [number, number] = [23.83, 90.41];

  return (
    <div className="w-full h-full relative z-0">
      {/* Loading skeleton */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-[-1]">
        <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">Loading map...</div>
      </div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          zIndex={100}
        />
        <MapController geoJsonData={boundariesData} zoneFilter={zoneFilter} />
      </MapContainer>
    </div>
  );
}
