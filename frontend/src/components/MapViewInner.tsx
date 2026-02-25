'use client';

import { useMemo, useEffect } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Feature, GeoJsonObject, Geometry } from 'geojson';
import dccData from '@/data/dcc_wards.json';

type Zone = 'DNCC' | 'DSCC';

type BoundaryProperties = {
  Name?: string | null;
  Name_1?: string | null;
};

type BoundaryFeature = Feature<Geometry, BoundaryProperties>;
type BoundaryFeatureCollection = FeatureCollection<Geometry, BoundaryProperties>;

const typedBoundaries = dccData as BoundaryFeatureCollection;

function getZone(feature: BoundaryFeature): Zone {
  const raw = `${feature.properties.Name ?? ''} ${feature.properties.Name_1 ?? ''}`.toLowerCase();
  return raw.includes('north') ? 'DNCC' : 'DSCC';
}

function FitToData({ data }: { data: BoundaryFeatureCollection }) {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(data as GeoJsonObject);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.25), { animate: false });
    }
  }, [data, map]);

  return null;
}

function RefreshMapSize() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 80);
    window.addEventListener('resize', map.invalidateSize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', map.invalidateSize);
    };
  }, [map]);

  return null;
}

export default function MapViewInner({ zoneFilter }: { zoneFilter?: Zone }) {
  const router = useRouter();

  const filteredData = useMemo<BoundaryFeatureCollection>(() => {
    if (!zoneFilter) return typedBoundaries;
    return {
      ...typedBoundaries,
      features: typedBoundaries.features.filter((feature) => getZone(feature) === zoneFilter),
    };
  }, [zoneFilter]);

  const styleFeature = (feature?: BoundaryFeature) => {
    if (!feature) {
      return { fillColor: '#e2e8f0', color: '#475569', weight: 1.2, fillOpacity: 0.75 };
    }

    const isNorth = getZone(feature) === 'DNCC';
    return {
      fillColor: isNorth ? '#dcfce7' : 'transparent',
      color: isNorth ? '#15803d' : '#be123c',
      weight: isNorth ? 2 : 3,
      fillOpacity: isNorth ? 0.85 : 0,
      fill: isNorth,
    };
  };

  const onEachFeature = (feature: BoundaryFeature, layer: L.Layer) => {
    const pathLayer = layer as L.Path;
    const zone = getZone(feature);
    const label = zone === 'DNCC' ? 'Dhaka North City Corporation' : 'Dhaka South City Corporation';

    layer.bindTooltip(label, { sticky: true });

    layer.on('mouseover', () => {
      pathLayer.setStyle({ weight: 3.2, fillOpacity: 1 });
    });

    layer.on('mouseout', () => {
      pathLayer.setStyle(styleFeature(feature));
    });

    layer.on('click', () => {
      router.push(zone === 'DNCC' ? '/dhaka-north' : '/dhaka-south');
    });
  };

  return (
    <div className="h-full min-h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <MapContainer
        center={[23.82, 90.4]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RefreshMapSize />
        <FitToData data={filteredData} />
        <GeoJSON
          key={zoneFilter ?? 'all'}
          data={filteredData as GeoJsonObject}
          style={(feature) => styleFeature(feature as BoundaryFeature)}
          onEachFeature={(feature, layer) => onEachFeature(feature as BoundaryFeature, layer)}
        />
      </MapContainer>
    </div>
  );
}
