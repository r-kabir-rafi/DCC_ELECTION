import { DNCC_ROWS, DSCC_ROWS, type CityElectionRow } from "@/components/CityCorporationElectionTable";

type CombinedRow = CityElectionRow & { corporation: "DNCC" | "DSCC" };

const COMBINED_ROWS: CombinedRow[] = [
  ...DNCC_ROWS.map((row) => ({ ...row, corporation: "DNCC" as const })),
  ...DSCC_ROWS.map((row) => ({ ...row, corporation: "DSCC" as const })),
].sort((a, b) => b.year - a.year || a.corporation.localeCompare(b.corporation));

export default function CityCorporationCombinedTableSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Dhaka City Corporation Election Results (Combined)</h2>
      <p className="mt-1 text-sm text-gray-600">Combined DNCC + DSCC mayoral election results from Wikipedia.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Corporation</th>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Election</th>
              <th className="px-4 py-3 font-semibold">Registered Voters</th>
              <th className="px-4 py-3 font-semibold">Votes Cast</th>
              <th className="px-4 py-3 font-semibold">Turnout</th>
              <th className="px-4 py-3 font-semibold">Winner (Party)</th>
              <th className="px-4 py-3 font-semibold">Runner-up (Party)</th>
              <th className="px-4 py-3 font-semibold">Wards Won (Winner)</th>
              <th className="px-4 py-3 font-semibold">Total Wards</th>
              <th className="px-4 py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {COMBINED_ROWS.map((row) => (
              <tr key={`${row.corporation}-${row.year}-${row.election}`} className="border-t border-gray-100 align-top">
                <td className="px-4 py-3 font-semibold text-gray-900">{row.corporation}</td>
                <td className="px-4 py-3 text-gray-700">{row.year}</td>
                <td className="px-4 py-3 text-gray-700">{row.election}</td>
                <td className="px-4 py-3 text-gray-700">{row.registeredVoters}</td>
                <td className="px-4 py-3 text-gray-700">{row.votesCast}</td>
                <td className="px-4 py-3 text-gray-700">{row.turnout}</td>
                <td className="px-4 py-3 text-gray-700">
                  {row.winner} ({row.winnerParty})
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {row.runnerUp} ({row.runnerUpParty})
                </td>
                <td className="px-4 py-3 text-gray-700">{row.winnerWardsWon}</td>
                <td className="px-4 py-3 text-gray-700">{row.totalWards}</td>
                <td className="px-4 py-3 text-gray-700">
                  <a href={row.sourceUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                    {row.sourceLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
