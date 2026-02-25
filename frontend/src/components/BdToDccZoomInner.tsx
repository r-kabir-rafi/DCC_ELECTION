'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from 'geojson';
import dccData from '@/data/dcc_wards.json';

type DccProperties = {
  Name?: string | null;
  Name_1?: string | null;
};

type DccFeature = Feature<Geometry, DccProperties>;
type DccCollection = FeatureCollection<Geometry, DccProperties>;

const dccCollection = dccData as DccCollection;

function getIsNorth(feature: DccFeature): boolean {
  const label = `${feature.properties.Name ?? ''} ${feature.properties.Name_1 ?? ''}`.toLowerCase();
  return label.includes('north');
}

function ZoomController({ replayKey }: { replayKey: number }) {
  const map = useMap();
  const [showDcc, setShowDcc] = useState(false);

  useEffect(() => {
    // Start from a country-level Bangladesh view.
    map.setView([23.72, 90.35], 7, { animate: false });

    const layer = L.geoJSON(dccCollection as GeoJsonObject);
    const bounds = layer.getBounds();

    const zoomTimer = setTimeout(() => {
      if (bounds.isValid()) {
        map.flyToBounds(bounds.pad(0.25), { duration: 2.4, easeLinearity: 0.25 });
      }
    }, 900);

    const showTimer = setTimeout(() => {
      setShowDcc(true);
    }, 3300);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(showTimer);
    };
  }, [map, replayKey]);

  return showDcc ? (
    <GeoJSON
      data={dccCollection as GeoJsonObject}
      style={(feature) => {
        const dccFeature = feature as DccFeature;
        const isNorth = getIsNorth(dccFeature);
        return {
          color: isNorth ? '#15803d' : '#be123c',
          weight: 3,
          fillOpacity: 0,
        };
      }}
    />
  ) : null;
}

export default function BdToDccZoomInner({ replayKey }: { replayKey: number }) {
  return (
    <MapContainer
      center={[23.7, 90.35]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      zoomControl
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomController replayKey={replayKey} />
    </MapContainer>
  );
}
