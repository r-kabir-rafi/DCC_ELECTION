'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const BdToDccZoomInner = dynamic(() => import('./BdToDccZoomInner'), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full rounded-xl border border-gray-200 bg-white" />,
});

export default function BdToDccZoomMap() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Bangladesh Map to DCC Area Zoom</p>
        <button
          type="button"
          onClick={() => setReplayKey((value) => value + 1)}
          className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Replay Zoom
        </button>
      </div>
      <div className="h-[420px] w-full overflow-hidden rounded-lg border border-gray-200">
        <BdToDccZoomInner key={replayKey} replayKey={replayKey} />
      </div>
    </div>
  );
}
