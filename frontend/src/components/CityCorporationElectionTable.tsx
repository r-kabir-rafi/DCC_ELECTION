type CityZone = "DNCC" | "DSCC";

export type CityElectionRow = {
  year: number;
  election: string;
  registeredVoters: string;
  votesCast: string;
  turnout: string;
  winner: string;
  winnerParty: string;
  winnerVotes: string;
  runnerUp: string;
  runnerUpParty: string;
  runnerUpVotes: string;
  majority: string;
  winnerWardsWon: string;
  runnerUpWardsWon: string;
  totalWards: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const DNCC_ROWS: CityElectionRow[] = [
  {
    year: 2019,
    election: "DNCC Mayoral By-election",
    registeredVoters: "3,035,599",
    votesCast: "942,539",
    turnout: "31.05%",
    winner: "Atiqul Islam",
    winnerParty: "Awami League",
    winnerVotes: "839,302",
    runnerUp: "Shafin Ahmed",
    runnerUpParty: "Jatiya Party",
    runnerUpVotes: "52,829",
    majority: "786,473",
    winnerWardsWon: "N/A",
    runnerUpWardsWon: "N/A",
    totalWards: "N/A",
    sourceLabel: "Wikipedia: 2019 DNCC by-election",
    sourceUrl: "https://en.wikipedia.org/wiki/2019_Dhaka_North_City_Corporation_by-election",
  },
  {
    year: 2020,
    election: "DNCC Election",
    registeredVoters: "3,012,509",
    votesCast: "762,188",
    turnout: "25.30%",
    winner: "Atiqul Islam",
    winnerParty: "Awami League",
    winnerVotes: "447,211",
    runnerUp: "Tabith Awal",
    runnerUpParty: "BNP",
    runnerUpVotes: "264,161",
    majority: "183,050",
    winnerWardsWon: "62",
    runnerUpWardsWon: "2",
    totalWards: "72",
    sourceLabel: "Wikipedia: 2020 DNCC election",
    sourceUrl: "https://en.wikipedia.org/wiki/2020_Dhaka_North_City_Corporation_election",
  },
  {
    year: 2015,
    election: "DNCC Election",
    registeredVoters: "2,344,900",
    votesCast: "874,581",
    turnout: "37.30%",
    winner: "Annisul Huq",
    winnerParty: "Awami League",
    winnerVotes: "460,117",
    runnerUp: "Tabith Awal",
    runnerUpParty: "BNP",
    runnerUpVotes: "325,080",
    majority: "135,037",
    winnerWardsWon: "32",
    runnerUpWardsWon: "2",
    totalWards: "48",
    sourceLabel: "Wikipedia: 2015 DNCC election",
    sourceUrl: "https://en.wikipedia.org/wiki/2015_Dhaka_North_City_Corporation_election",
  },
];

export const DSCC_ROWS: CityElectionRow[] = [
  {
    year: 2020,
    election: "DSCC Election",
    registeredVoters: "2,453,194",
    votesCast: "711,488",
    turnout: "28.99%",
    winner: "Sheikh Fazle Noor Taposh",
    winnerParty: "Awami League",
    winnerVotes: "424,595",
    runnerUp: "Ishraque Hossain",
    runnerUpParty: "BNP",
    runnerUpVotes: "236,512",
    majority: "188,083",
    winnerWardsWon: "81",
    runnerUpWardsWon: "9",
    totalWards: "100",
    sourceLabel: "Wikipedia: 2020 DSCC election",
    sourceUrl: "https://en.wikipedia.org/wiki/2020_Dhaka_South_City_Corporation_election",
  },
  {
    year: 2015,
    election: "DSCC Election",
    registeredVoters: "1,870,778",
    votesCast: "905,484",
    turnout: "48.40%",
    winner: "Sayeed Khokon",
    winnerParty: "Awami League",
    winnerVotes: "535,296",
    runnerUp: "Mirza Abbas",
    runnerUpParty: "BNP",
    runnerUpVotes: "294,291",
    majority: "241,005",
    winnerWardsWon: "54",
    runnerUpWardsWon: "8",
    totalWards: "76",
    sourceLabel: "Wikipedia: 2015 DSCC election",
    sourceUrl: "https://en.wikipedia.org/wiki/2015_Dhaka_South_City_Corporation_election",
  },
];

export default function CityCorporationElectionTable({ zone }: { zone: CityZone }) {
  const rows = zone === "DNCC" ? DNCC_ROWS : DSCC_ROWS;
  const footnote =
    zone === "DSCC"
      ? "All DSCC direct mayoral elections available on Wikipedia are included (2015, 2020)."
      : "All DNCC direct mayoral elections and by-election available on Wikipedia are included (2015, 2019 by-election, 2020).";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Wikipedia Election Results Summary</h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
          Results
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Registered voters, votes cast, winner/runner-up, party, and total wards won.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Registered Voters</th>
              <th className="px-4 py-3 font-semibold">Votes Cast</th>
              <th className="px-4 py-3 font-semibold">Turnout</th>
              <th className="px-4 py-3 font-semibold">Winner (Party)</th>
              <th className="px-4 py-3 font-semibold">Winner Votes</th>
              <th className="px-4 py-3 font-semibold">Runner-up (Party)</th>
              <th className="px-4 py-3 font-semibold">Runner-up Votes</th>
              <th className="px-4 py-3 font-semibold">Majority</th>
              <th className="px-4 py-3 font-semibold">Wards Won (Winner)</th>
              <th className="px-4 py-3 font-semibold">Wards Won (Runner-up)</th>
              <th className="px-4 py-3 font-semibold">Total Wards</th>
              <th className="px-4 py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${zone}-${row.year}`} className="border-t border-gray-100 align-top transition-colors hover:bg-indigo-50/50">
                <td className="px-4 py-3 font-semibold text-gray-900">{row.year}</td>
                <td className="px-4 py-3 text-gray-700">{row.registeredVoters}</td>
                <td className="px-4 py-3 text-gray-700">{row.votesCast}</td>
                <td className="px-4 py-3 text-gray-700">{row.turnout}</td>
                <td className="px-4 py-3 text-gray-700">
                  {row.winner} ({row.winnerParty})
                </td>
                <td className="px-4 py-3 text-gray-700">{row.winnerVotes}</td>
                <td className="px-4 py-3 text-gray-700">
                  {row.runnerUp} ({row.runnerUpParty})
                </td>
                <td className="px-4 py-3 text-gray-700">{row.runnerUpVotes}</td>
                <td className="px-4 py-3 text-gray-700">{row.majority}</td>
                <td className="px-4 py-3 text-gray-700">{row.winnerWardsWon}</td>
                <td className="px-4 py-3 text-gray-700">{row.runnerUpWardsWon}</td>
                <td className="px-4 py-3 text-gray-700">{row.totalWards}</td>
                <td className="px-4 py-3 text-gray-700">
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {row.sourceLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-500">{footnote}</p>
    </section>
  );
}
