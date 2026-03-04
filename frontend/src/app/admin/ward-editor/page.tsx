'use client';

import dynamic from 'next/dynamic';

const WardEditorClient = dynamic(
    () => import('./WardEditorClient'),
    {
        ssr: false, loading: () => (
            <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
                    <p className="text-sm text-gray-500">Loading Ward Editor…</p>
                </div>
            </div>
        )
    }
);

export default function WardEditorPage() {
    return <WardEditorClient />;
}
