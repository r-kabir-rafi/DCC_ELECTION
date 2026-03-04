// ═══════════════════════════════════════════════════════════
// DCC Election Atlas — Core Type Definitions
// ═══════════════════════════════════════════════════════════

import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson';

/** City corporation codes */
export type CityCode = 'DNCC' | 'DSCC' | 'DCC';

/** Layer/feature types */
export type LayerType = 'ward' | 'thana' | 'constituency';

/** Properties attached to every GeoJSON feature */
export interface GeoFeatureProperties {
  id: string;
  name: string;
  city: CityCode;
  type: LayerType;
  code?: string;
  ward_no?: number;
  thana?: string;
}

/** Registry item — may or may not have geometry */
export interface RegistryItem {
  id: string;
  name: string;
  city: CityCode;
  type: LayerType;
  code?: string;
  ward_no?: number;
  thana?: string;
  mapped?: boolean;
}

/** Typed GeoJSON feature */
export type DccFeature = Feature<Polygon | MultiPolygon, GeoFeatureProperties>;

/** Typed GeoJSON feature collection */
export type DccFeatureCollection = FeatureCollection<Polygon | MultiPolygon, GeoFeatureProperties>;

/** List item in the sidebar — combines registry info with mapping status */
export interface ListItem extends RegistryItem {
  /** true if geometry is available in the geojson */
  hasBoundary: boolean;
}

/** Validation result for ward editor */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
