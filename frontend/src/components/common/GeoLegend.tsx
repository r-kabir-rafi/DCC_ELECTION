import { LAYER_COLORS } from '@/lib/geo';

interface LegendEntry {
    label: string;
    type: string;
}

interface GeoLegendProps {
    entries: LegendEntry[];
    className?: string;
}

export default function GeoLegend({ entries, className = '' }: GeoLegendProps) {
    return (
        <div className={`flex flex-wrap items-center gap-3 rounded-lg bg-white/80 px-3 py-2 text-xs font-medium backdrop-blur dark:bg-slate-800/80 ${className}`}>
            {entries.map(entry => {
                const color = LAYER_COLORS[entry.type] || LAYER_COLORS.ward;
                return (
                    <div key={entry.type} className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-3 w-3 rounded-sm border"
                            style={{
                                backgroundColor: color.fill,
                                borderColor: color.stroke,
                                opacity: color.fillOpacity + 0.3,
                            }}
                        />
                        <span className="text-gray-600 dark:text-gray-300">{entry.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
