import ConstituencyMapSection from './components/ConstituencyMapSection';
import { CONSTITUENCIES_CONTENT } from './content';

export default function DccConstituenciesPage() {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
            <div className="border-b border-gray-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-slate-900 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {CONSTITUENCIES_CONTENT.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {CONSTITUENCIES_CONTENT.subtitle}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <ConstituencyMapSection />
            </div>
        </div>
    );
}
