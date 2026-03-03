import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white px-6 py-8 dark:border-white/10 dark:bg-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Dhaka Election Atlas</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Interactive election constituency explorer for Dhaka City Corporation
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>Built with</span>
                        <Heart className="h-3 w-3 text-rose-500" />
                        <span>using Next.js, Leaflet &amp; Recharts</span>
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4 text-center dark:border-white/5">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Data sourced from public election records. For educational purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
}
