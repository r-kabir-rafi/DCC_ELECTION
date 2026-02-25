'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUICK_NAV_OPTIONS, type QuickNavZone } from '@/data/constituencies';

export default function ConstituencyQuickNav() {
  const router = useRouter();
  const [zone, setZone] = useState<QuickNavZone>('DNCC');

  const constituencyOptions = useMemo(() => QUICK_NAV_OPTIONS[zone], [zone]);
  const [seatId, setSeatId] = useState<string>(QUICK_NAV_OPTIONS.DNCC[0].seatId);

  return (
    <section className="mx-auto mt-8 w-full rounded-2xl border border-gray-200 bg-white/95 p-5 text-left shadow-lg backdrop-blur">
      <h2 className="text-lg font-bold text-gray-900">Quick Constituency Navigator</h2>
      <p className="mt-1 text-sm text-gray-600">Choose city corporation and constituency to jump directly.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select
          value={zone}
          onChange={(e) => {
            const nextZone = e.target.value as QuickNavZone;
            setZone(nextZone);
            setSeatId(QUICK_NAV_OPTIONS[nextZone][0].seatId);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500"
          aria-label="Select corporation"
        >
          <option value="DNCC">DNCC</option>
          <option value="DSCC">DSCC</option>
        </select>

        <select
          value={seatId}
          onChange={(e) => setSeatId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500"
          aria-label="Select constituency"
        >
          {constituencyOptions.map((item) => (
            <option key={item.seatId} value={item.seatId}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => router.push(`/constituency/${seatId}`)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go to Constituency
        </button>
      </div>
    </section>
  );
}
