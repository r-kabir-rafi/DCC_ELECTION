'use client';

import SearchBox from "@/components/SearchBox";
import Legend from "@/components/Legend";
import ConstituencyPanel from "@/components/ConstituencyPanel";
import MapView from "@/components/MapView";

export default function DhakaSouthPage() {
  return (
    <section className="h-[calc(100vh-4rem)] w-full">
      <div className="relative h-full w-full md:flex">
        <div className="relative h-full w-full md:flex-1">
          <MapView zoneFilter="DSCC" />
          <SearchBox zoneFilter="DSCC" />
          <Legend />
        </div>
        <ConstituencyPanel />
      </div>
    </section>
  );
}
