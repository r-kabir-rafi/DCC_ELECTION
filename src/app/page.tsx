import Link from "next/link";
import { Map, MapPin, BarChart3, Layers } from "lucide-react";

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute -top-[15%] -left-[10%] h-[50%] w-[50%] rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute -bottom-[15%] -right-[10%] h-[55%] w-[55%] rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-900/10" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl animate-fade-in">
          {/* Badge */}
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Layers className="h-3.5 w-3.5" />
            Election Intelligence Platform
          </p>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-6xl md:leading-tight">
            Explore Dhaka Constituencies With{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Interactive Election Data
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
            View constituency boundaries, compare city and national election
            results, and inspect winner trends with map-first analytics.
          </p>

          {/* Stats pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Map, label: "6 Constituencies" },
              { icon: MapPin, label: "2 Zones (DNCC + DSCC)" },
              { icon: BarChart3, label: "2 Election Types" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              >
                <Icon className="h-3.5 w-3.5 text-indigo-500" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 animate-slide-up">
          <Link
            href="/constituencies"
            className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
          >
            <Map className="h-4 w-4 transition-transform group-hover:scale-110" />
            Open Constituency Map
          </Link>
          <Link
            href="/dhaka-north"
            className="flex items-center gap-2 rounded-xl border-2 border-indigo-100 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-95 dark:border-indigo-400/30 dark:bg-white/5 dark:text-indigo-300 dark:hover:border-indigo-400/60"
          >
            <MapPin className="h-4 w-4 text-indigo-400" />
            Dhaka North (DNCC)
          </Link>
          <Link
            href="/dhaka-south"
            className="flex items-center gap-2 rounded-xl border-2 border-indigo-100 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md active:scale-95 dark:border-indigo-400/30 dark:bg-white/5 dark:text-indigo-300 dark:hover:border-indigo-400/60"
          >
            <MapPin className="h-4 w-4 text-indigo-400" />
            Dhaka South (DSCC)
          </Link>
        </div>
      </div>
    </section>
  );
}
