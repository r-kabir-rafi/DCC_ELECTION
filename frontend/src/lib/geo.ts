// ═══════════════════════════════════════════════════════════
// GIS Utility Functions
// ═══════════════════════════════════════════════════════════

import type { LatLngBoundsExpression } from 'leaflet';
import type { DccFeature, DccFeatureCollection, ValidationResult } from './types';

/** Default center for Dhaka */
export const DHAKA_CENTER: [number, number] = [23.78, 90.40];
export const DHAKA_ZOOM = 12;

/** DNCC approximate center */
export const DNCC_CENTER: [number, number] = [23.85, 90.39];
export const DNCC_ZOOM = 12;

/** DSCC approximate center */
export const DSCC_CENTER: [number, number] = [23.73, 90.40];
export const DSCC_ZOOM = 13;

/**
 * Calculate bounding box of a GeoJSON feature collection.
 */
export function getBounds(fc: DccFeatureCollection): LatLngBoundsExpression {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  for (const feature of fc.features) {
    const coords = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates
      : feature.geometry.coordinates.flat();

    for (const ring of coords) {
      for (const point of ring) {
        const [lng, lat] = point as [number, number];
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      }
    }
  }

  return [[minLat, minLng], [maxLat, maxLng]];
}

/**
 * Get bounding box of a single feature.
 */
export function getFeatureBounds(feature: DccFeature): LatLngBoundsExpression {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  const coords = feature.geometry.type === 'Polygon'
    ? feature.geometry.coordinates
    : feature.geometry.coordinates.flat();

  for (const ring of coords) {
    for (const point of ring) {
      const [lng, lat] = point as [number, number];
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
  }

  return [[minLat, minLng], [maxLat, maxLng]];
}

/**
 * Get center of a feature's bounding box.
 */
export function getFeatureCenter(feature: DccFeature): [number, number] {
  const bounds = getFeatureBounds(feature) as [[number, number], [number, number]];
  return [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2,
  ];
}

/**
 * Layer color palette by type
 */
export const LAYER_COLORS: Record<string, { fill: string; stroke: string; fillOpacity: number }> = {
  constituency: { fill: '#6366f1', stroke: '#4338ca', fillOpacity: 0.25 },
  ward: { fill: '#10b981', stroke: '#059669', fillOpacity: 0.30 },
  thana: { fill: '#f59e0b', stroke: '#d97706', fillOpacity: 0.20 },
};

/** Highlight color when feature is selected */
export const HIGHLIGHT_COLOR = { fill: '#ef4444', stroke: '#dc2626', fillOpacity: 0.45 };

/**
 * Validate a GeoJSON FeatureCollection for the ward editor.
 */
export function validateGeoJSON(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Input is not a valid object'], warnings };
  }

  const fc = data as Record<string, unknown>;

  if (fc.type !== 'FeatureCollection') {
    errors.push('Root "type" must be "FeatureCollection"');
  }

  if (!Array.isArray(fc.features)) {
    errors.push('"features" must be an array');
    return { valid: false, errors, warnings };
  }

  const wardNos = new Set<string>();

  for (let i = 0; i < fc.features.length; i++) {
    const f = fc.features[i] as Record<string, unknown>;

    if (f.type !== 'Feature') {
      errors.push(`features[${i}]: "type" must be "Feature"`);
      continue;
    }

    const geom = f.geometry as Record<string, unknown> | undefined;
    if (!geom) {
      errors.push(`features[${i}]: missing "geometry"`);
      continue;
    }

    if (geom.type !== 'Polygon' && geom.type !== 'MultiPolygon') {
      errors.push(`features[${i}]: geometry type must be "Polygon" or "MultiPolygon", got "${geom.type}"`);
    }

    // Check ring closure and minimum vertices
    if (geom.type === 'Polygon') {
      const coords = geom.coordinates as number[][][];
      if (coords && coords[0]) {
        const ring = coords[0];
        if (ring.length < 4) {
          errors.push(`features[${i}]: polygon ring must have at least 4 coordinates (3 vertices + closing)`);
        }
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
          errors.push(`features[${i}]: polygon ring is not closed`);
        }
      }
    }

    const props = f.properties as Record<string, unknown> | undefined;
    if (!props) {
      errors.push(`features[${i}]: missing "properties"`);
      continue;
    }

    if (!props.ward_no && props.ward_no !== 0) {
      errors.push(`features[${i}]: "ward_no" is required`);
    } else {
      const city = (props.city || 'unknown') as string;
      const key = `${city}-${props.ward_no}`;
      if (wardNos.has(key)) {
        errors.push(`features[${i}]: duplicate ward_no ${props.ward_no} for city ${city}`);
      }
      wardNos.add(key);
    }

    if (!props.ward_name && !props.name) {
      warnings.push(`features[${i}]: missing "ward_name" or "name"`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
