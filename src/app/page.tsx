import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
            Election Intelligence Platform
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Explore Dhaka Constituencies With Interactive Election Data
          </h1>
          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            View constituency boundaries, compare city and national election
            results, and inspect winner trends with map-first analytics.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/constituencies"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Open Constituency Map
          </Link>
          <Link
            href="/dhaka-north"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Dhaka North (DNCC)
          </Link>
          <Link
            href="/dhaka-south"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Dhaka South (DSCC)
          </Link>
        </div>
      </div>
    </section>
  );
}
