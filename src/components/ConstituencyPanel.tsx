'use client';
import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getConstituencyResults, getLatestResult } from '@/lib/data';
import boundaries from '@/data/boundaries.sample.geojson';
import { getPartyColor } from '@/lib/geo';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { X, TrendingUp, Users, CheckCircle, Navigation } from 'lucide-react';

export default function ConstituencyPanel() {
  const { mode, selectedConstituency, setSelectedConstituency } = useAppStore();

  const details = useMemo(() => {
    if (!selectedConstituency) return null;
    
    const feature = boundaries.features.find((f: any) => f.properties.id === selectedConstituency);
    if (!feature) return null;

    const latest = getLatestResult(mode, selectedConstituency);
    const history = getConstituencyResults(mode, selectedConstituency);

    // Prepare chart data: sorted by year ascending
    const chartData = [...history].sort((a, b) => a.year - b.year);

    return {
      id: feature.properties.id,
      name: feature.properties.name,
      zone: feature.properties.zone,
      latest,
      history,
      chartData
    };
  }, [mode, selectedConstituency]);

  if (!selectedConstituency || !details) return null;

  return (
    <div className="fixed md:static bottom-0 left-0 right-0 md:w-96 bg-white shadow-2xl z-[500] md:h-[calc(100vh-4rem)] flex flex-col border-t md:border-t-0 md:border-l border-gray-200 transition-transform transform rounded-t-3xl md:rounded-none overflow-hidden max-h-[80vh] md:max-h-full">
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{details.name}</h2>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">ID: {details.id} {details.zone && `• ${details.zone}`}</p>
          </div>
          <button 
            onClick={() => setSelectedConstituency(null)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!details.latest ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-gray-400 mb-2 mt-4 text-center">No data available for this constituency in currently selected election type.</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100/50">
                <div className="flex items-center text-indigo-700 mb-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wide">Winner</span>
                </div>
                <div className="text-lg font-bold text-gray-900 truncate" title={details.latest.winner_name}>{details.latest.winner_name}</div>
                <div className="text-sm font-medium" style={{ color: getPartyColor(details.latest.winner_party) }}>{details.latest.winner_party}</div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-2xl border border-rose-100/50">
                <div className="flex items-center text-rose-700 mb-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wide">Runner Up</span>
                </div>
                <div className="text-lg font-bold text-gray-900 truncate">{details.latest.runner_up_party}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100/50">
                <div className="flex items-center text-green-700 mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wide">Turnout</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{details.latest.turnout}%</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-2xl border border-amber-100/50">
                <div className="flex items-center text-amber-700 mb-1">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wide">Total Votes</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{(details.latest.total_votes / 1000).toFixed(1)}k</div>
              </div>
            </div>

            {/* Historic Results Chart */}
            <div className="bg-white border text-center border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4 text-left">Historical Turnout (%)</h3>
              {details.chartData.length > 0 ? (
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={details.chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#F3F4F6' }}
                      />
                      <Bar dataKey="turnout" radius={[4, 4, 0, 0]}>
                        {details.chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={getPartyColor(entry.winner_party)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Not enough data to graph.</p>
              )}
            </div>

            {/* List View */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 ml-1">Past Results</h3>
              <div className="space-y-3">
                {details.history.map((h) => (
                  <div key={h.year} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center transition-all hover:bg-gray-100">
                    <div>
                      <div className="font-extrabold text-gray-900 text-lg mb-1">{h.year}</div>
                      <div className="flex items-center text-sm font-medium">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getPartyColor(h.winner_party) }}></span>
                        {h.winner_party}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{h.margin}% margin</div>
                      <div className="text-xs text-gray-500 font-medium">{h.turnout}% turnout</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
