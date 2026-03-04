import { METHODOLOGY_CONTENT } from './content';
import { Database, Globe, PenTool, ShieldCheck, MapPin, FileJson } from 'lucide-react';

const SECTIONS = [
    {
        icon: Globe,
        title: 'GIS Boundary Data',
        items: [
            'City corporation boundaries sourced from official GIS datasets and publicly available shapefiles.',
            'Parliamentary constituency boundaries based on Election Commission of Bangladesh published data.',
            'Thana (police station) boundaries from Bangladesh Bureau of Statistics and open government data.',
        ],
    },
    {
        icon: PenTool,
        title: 'Ward Boundary Tracing',
        items: [
            'Ward GIS boundaries are not publicly available in digital format for all areas.',
            'We use Google Maps ONLY as a visual reference to identify ward area names and approximate locations.',
            'Boundaries are manually traced using the Ward Editor tool built into this application.',
            'NO scraping, NO automated extraction, NO bypassing of any restrictions.',
            'Each ward polygon is hand-drawn and exported as standard GeoJSON.',
        ],
    },
    {
        icon: Database,
        title: 'Election Results Data',
        items: [
            'City corporation election data will be sourced from official Election Commission results.',
            'National election data (parliamentary seats) from published gazette notifications.',
            'Results are stored as structured JSON and will be linked to constituency GeoJSON features.',
            'Election data integration is in progress — placeholders shown where data is pending.',
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Data Quality & Validation',
        items: [
            'All GeoJSON files are validated for format compliance (FeatureCollection, closed rings, minimum vertices).',
            'Ward numbers must be unique within each city corporation.',
            'Registry files maintain a complete list of all wards even if geometry is not yet available.',
            'Features with missing boundaries are clearly marked as "not mapped yet" in all lists.',
        ],
    },
    {
        icon: MapPin,
        title: 'Geographic Layers',
        items: [
            'Wards: Smallest administrative units within each city corporation.',
            'Thanas: Police station jurisdictions that may span multiple wards.',
            'Constituencies: Parliamentary seat boundaries that may overlap with one or both city corporations.',
        ],
    },
    {
        icon: FileJson,
        title: 'Data Format',
        items: [
            'All spatial data uses standard GeoJSON (RFC 7946) format.',
            'Coordinate reference system: WGS 84 (EPSG:4326).',
            'Properties follow a consistent schema: id, name, city, type, code/ward_no.',
            'Registry JSON files provide metadata for items that may not yet have spatial data.',
        ],
    },
];

export default function MethodologyPage() {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
            <div className="border-b border-gray-200 bg-white px-4 py-8 dark:border-white/10 dark:bg-slate-900 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {METHODOLOGY_CONTENT.title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {METHODOLOGY_CONTENT.subtitle}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="space-y-8">
                    {SECTIONS.map(section => (
                        <div
                            key={section.title}
                            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                    <section.icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {section.title}
                                </h2>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {section.items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        ⚠️ Disclaimer
                    </p>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                        This is a research and visualization project. Boundary data may not be 100% accurate.
                        Always refer to official Election Commission and government publications for authoritative data.
                    </p>
                </div>
            </div>
        </div>
    );
}
