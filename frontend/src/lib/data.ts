// ═══════════════════════════════════════════════════════════
// Data Loading & Merging Utilities
// ═══════════════════════════════════════════════════════════

import type { CityCode, DccFeatureCollection, ListItem, RegistryItem } from './types';

// ── GeoJSON imports ──────────────────────────────────────
import dccConstituencies from '../data/dcc.constituencies.json';
import dccThanas from '../data/dcc.thanas.json';
import dnccWards from '../data/dncc.wards.json';
import dsccWards from '../data/dscc.wards.json';

// ── Registry imports ─────────────────────────────────────
import dnccWardsRegistry from '../data/registries/dncc.wards.registry.json';
import dsccWardsRegistry from '../data/registries/dscc.wards.registry.json';
import dnccThanasRegistry from '../data/registries/dncc.thanas.registry.json';
import dsccThanasRegistry from '../data/registries/dscc.thanas.registry.json';
import dccConstituenciesRegistry from '../data/registries/dcc.constituencies.registry.json';

// ── GeoJSON getters ──────────────────────────────────────

export function getConstituenciesGeoJSON(): DccFeatureCollection {
  return dccConstituencies as unknown as DccFeatureCollection;
}

export function getConstituenciesByCity(city: CityCode): DccFeatureCollection {
  const all = getConstituenciesGeoJSON();
  return {
    type: 'FeatureCollection',
    features: all.features.filter(f => f.properties.city === city),
  };
}

export function getThanasGeoJSON(): DccFeatureCollection {
  return dccThanas as unknown as DccFeatureCollection;
}

export function getThanasByCity(city: CityCode): DccFeatureCollection {
  const all = getThanasGeoJSON();
  return {
    type: 'FeatureCollection',
    features: all.features.filter(f => f.properties.city === city),
  };
}

export function getWardsGeoJSON(city: CityCode): DccFeatureCollection {
  if (city === 'DNCC') return dnccWards as unknown as DccFeatureCollection;
  if (city === 'DSCC') return dsccWards as unknown as DccFeatureCollection;
  // For 'DCC' return merged
  return {
    type: 'FeatureCollection',
    features: [
      ...(dnccWards as unknown as DccFeatureCollection).features,
      ...(dsccWards as unknown as DccFeatureCollection).features,
    ],
  };
}

// ── Registry getters ─────────────────────────────────────

export function getWardRegistry(city: CityCode): RegistryItem[] {
  if (city === 'DNCC') return dnccWardsRegistry as RegistryItem[];
  if (city === 'DSCC') return dsccWardsRegistry as RegistryItem[];
  return [...(dnccWardsRegistry as RegistryItem[]), ...(dsccWardsRegistry as RegistryItem[])];
}

export function getThanaRegistry(city: CityCode): RegistryItem[] {
  if (city === 'DNCC') return dnccThanasRegistry as RegistryItem[];
  if (city === 'DSCC') return dsccThanasRegistry as RegistryItem[];
  return [...(dnccThanasRegistry as RegistryItem[]), ...(dsccThanasRegistry as RegistryItem[])];
}

export function getConstituencyRegistry(): RegistryItem[] {
  return dccConstituenciesRegistry as RegistryItem[];
}

export function getConstituencyRegistryByCity(city: CityCode): RegistryItem[] {
  return (dccConstituenciesRegistry as RegistryItem[]).filter(r => r.city === city);
}

// ── Merged list items (registry + geometry status) ───────

export function getWardListItems(city: CityCode): ListItem[] {
  const registry = getWardRegistry(city);
  const geo = getWardsGeoJSON(city);
  const mappedIds = new Set(geo.features.map(f => f.properties.id));

  return registry.map(r => ({
    ...r,
    hasBoundary: mappedIds.has(r.id),
  }));
}

export function getThanaListItems(city: CityCode): ListItem[] {
  const registry = getThanaRegistry(city);
  const geo = getThanasByCity(city);
  const mappedIds = new Set(geo.features.map(f => f.properties.id));

  return registry.map(r => ({
    ...r,
    hasBoundary: mappedIds.has(r.id),
  }));
}

export function getConstituencyListItems(city?: CityCode): ListItem[] {
  const registry = city ? getConstituencyRegistryByCity(city) : getConstituencyRegistry();
  const geo = getConstituenciesGeoJSON();
  const mappedIds = new Set(geo.features.map(f => f.properties.id));

  return registry.map(r => ({
    ...r,
    hasBoundary: mappedIds.has(r.id),
  }));
}
