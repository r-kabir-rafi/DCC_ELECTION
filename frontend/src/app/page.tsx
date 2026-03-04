import Link from "next/link";
import { Map, MapPin, BookOpen, Shield } from "lucide-react";

const STAT_CARDS = [
  { label: "DNCC Wards", value: "54", icon: MapPin, color: "from-emerald-500 to-teal-600" },
  { label: "DSCC Wards", value: "75", icon: MapPin, color: "from-blue-500 to-indigo-600" },
  { label: "Constituencies", value: "20", icon: Map, color: "from-violet-500 to-purple-600" },
  { label: "Thanas", value: "41", icon: Shield, color: "from-amber-500 to-orange-600" },
];

const EXPLORE_LINKS = [
  { href: "/dhaka-north", label: "Dhaka North (DNCC)", desc: "54 wards · 8 constituencies", color: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-800" },
  { href: "/dhaka-south", label: "Dhaka South (DSCC)", desc: "75 wards · 8 constituencies", color: "border-blue-200 hover:border-blue-400 dark:border-blue-800" },
  { href: "/dcc-constituencies", label: "DCC Constituencies", desc: "All parliamentary constituencies across DCC", color: "border-violet-200 hover:border-violet-400 dark:border-violet-800" },
  { href: "/dcc-thanas", label: "DCC Thanas", desc: "Police station boundaries across DCC", color: "border-amber-200 hover:border-amber-400 dark:border-amber-800" },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6 py-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Abstract blobs */}
        <div className="absolute top-[-15%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Dhaka City Corporation{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              GIS &amp; Election Atlas
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
            Explore interactive maps, ward boundaries, parliamentary constituencies, and thana polygons for Dhaka North and Dhaka South City Corporations.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dhaka-north"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-emerald-500/25"
            >
              <MapPin size={16} /> Explore DNCC
            </Link>
            <Link
              href="/dhaka-south"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-blue-500/25"
            >
              <MapPin size={16} /> Explore DSCC
            </Link>
            <Link
              href="/methodology"
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            >
              <BookOpen size={16} /> Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STAT_CARDS.map(stat => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/5 dark:bg-slate-900"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-5`} />
              <div className="relative">
                <stat.icon size={20} className="mb-2 text-gray-400" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore links */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-100">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EXPLORE_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`group rounded-xl border-2 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${link.color}`}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{link.label}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
              <span className="mt-3 inline-block text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Open map →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
