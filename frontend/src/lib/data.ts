import cityResults from '../data/city_results.sample.json';
import nationalResults from '../data/national_results.sample.json';
import { ElectionResult } from './types';

export const getResultsByMode = (mode: 'city' | 'national'): ElectionResult[] => {
  return mode === 'city' ? (cityResults as ElectionResult[]) : (nationalResults as ElectionResult[]);
};

export const getConstituencyResults = (mode: 'city' | 'national', id: string): ElectionResult[] => {
  const allResults = getResultsByMode(mode);
  return allResults
    .filter((r) => r.constituency_id === id)
    .sort((a, b) => b.year - a.year);
};

export const getLatestResult = (mode: 'city' | 'national', id: string): ElectionResult | undefined => {
  const results = getConstituencyResults(mode, id);
  return results[0];
};

export const getAllConstituencies = () => {
  // Return unique constituencies from the active dataset. 
  // In a real app we would combine geometry and both result sets.
  const city = Array.from(new Set(cityResults.map(r => r.constituency_id)));
  const nat = Array.from(new Set(nationalResults.map(r => r.constituency_id)));
  return Array.from(new Set([...city, ...nat]));
};
