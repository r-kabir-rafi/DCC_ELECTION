import { SEAT_TO_CONSTITUENCY } from "@/data/constituencies";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface ConstituencyPageProps {
  params: Promise<{ id: string }>;
}

type ApiSeatSummary = {
  id?: number | string;
  seat_no?: string;
  total_voter?: number | string;
  total_center?: number | string;
  center?: number | string;
  winer_name?: string;
  winner_name?: string;
  winer_league?: string;
  winner_league?: string;
};

type ApiCandidate = {
  [key: string]: unknown;
  id?: number | string;
  candidate_name?: string;
  name?: string;
  league?: string;
  symbol?: string;
  vote?: number | string;
  center?: number | string;
  percentage?: number | string;
  vote_percentage?: number | string;
  candidate_image?: string;
  image?: string;
  party_image?: string;
  party_logo?: string;
};

type ApiSeatListEntry = {
  id?: number | string;
  seat_no?: number | string;
};

type SeatData = {
  seatSummary?: ApiSeatSummary;
  candidates: ApiCandidate[];
  rawCandidateHtml?: string;
  source: "live" | "local";
};

type ElectionHistoryEntry = {
  year: number;
  election: string;
  winner: string;
  party: string;
  notes: string;
};

const CONSTITUENCY_DETAILS: Record<string, string> = {
  "Dhaka-1": "Covers Dohar and Nawabganj upazilas.",
  "Dhaka-2":
    "Includes DSCC Wards 55, 56, and 57 (Kamrangirchar/Sultanganj), shared with parts of Keraniganj and Savar upazilas.",
  "Dhaka-3": "Covers the main part of Keraniganj.",
  "Dhaka-4": "Wards 47, 51-54 (Shyampur, Kadamtali).",
  "Dhaka-5": "Wards 48-50, 62-70 (Jatrabari, Demra).",
  "Dhaka-6": "Wards 34, 37-46 (Sutrapur, Gendaria, Wari).",
  "Dhaka-7": "Wards 23-33, 35, 36, 55-57 (Lalbagh, Chawkbazar).",
  "Dhaka-8": "Wards 8-13, 19-21 (Ramna, Motijheel, Paltan).",
  "Dhaka-9": "Wards 1-7, 71-75.",
  "Dhaka-10": "Wards 14-18, 22, 58-61 (Dhanmondi, Hazaribagh).",
  "Dhaka-11": "Wards 21-23, 37, 38, 41, 42.",
  "Dhaka-12": "Wards 24-27, 35, 36.",
  "Dhaka-13": "Wards 28-34.",
  "Dhaka-14": "Wards 7-12.",
  "Dhaka-15": "Wards 4, 13, 14, 16.",
  "Dhaka-16": "Wards 2, 3, 5, 6.",
  "Dhaka-17": "Wards 15, 18-20, 39, 40.",
  "Dhaka-18": "Wards 1, 17, 43-54 (Uttara/Khilkhet area).",
  "Dhaka-19": "Covers Savar and Ashulia.",
  "Dhaka-20": "Covers Dhamrai Upazila.",
};

const CONSTITUENCY_VOTERS: Record<string, string> = {
  "Dhaka-1": "545,140",
  "Dhaka-2": "419,215",
  "Dhaka-3": "362,159",
  "Dhaka-4": "362,506",
  "Dhaka-5": "419,996",
  "Dhaka-6": "292,283",
  "Dhaka-7": "479,376",
  "Dhaka-8": "275,471",
  "Dhaka-9": "469,360",
  "Dhaka-10": "388,660",
  "Dhaka-11": "439,078",
  "Dhaka-12": "333,320",
  "Dhaka-13": "408,791",
  "Dhaka-14": "456,044",
  "Dhaka-15": "351,718",
  "Dhaka-16": "400,499",
  "Dhaka-17": "333,777",
  "Dhaka-18": "613,883",
  "Dhaka-19": "747,070",
  "Dhaka-20": "376,639",
};

const CONSTITUENCY_HISTORY: Record<string, ElectionHistoryEntry[]> = Object.fromEntries(
  Object.entries(CONSTITUENCY_DETAILS).map(([name, notes]) => [
    name,
    [
      {
        year: 2026,
        election: "General Election",
        winner: "To be added",
        party: "To be added",
        notes,
      },
    ],
  ]),
) as Record<string, ElectionHistoryEntry[]>;

function formatNumber(value: number | string | undefined): string {
  const numeric = parseNumeric(value);
  if (!Number.isFinite(numeric)) return "To be added";
  return new Intl.NumberFormat("en-US").format(numeric);
}

function parseNumeric(value: number | string | undefined | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function hasUsableData(data: Pick<SeatData, "seatSummary" | "candidates" | "rawCandidateHtml">): boolean {
  return Boolean(data.seatSummary || data.rawCandidateHtml || data.candidates.length > 0);
}

function absolutizeTribuneAsset(fileNameOrPath: string | undefined, folder: "candidate" | "party"): string | null {
  if (!fileNameOrPath) return null;
  const raw = fileNameOrPath.trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const cleaned = raw.replace(/^\.?\//, "").replace(/^upload\//, "").replace(/^candidate\//, "").replace(/^party\//, "");
  if (cleaned.includes("/")) {
    return `https://election.dhakatribune.com/${cleaned}`;
  }
  return `https://election.dhakatribune.com/upload/${folder}/${cleaned}`;
}

function readArrayPayload<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
  }
  return [];
}

async function getLiveSeatData(id: string): Promise<SeatData> {
  try {
    const seatRes = await fetch(`https://election.dhakatribune.com/get-home-seats/${id}`, { cache: "no-store" });

    const seatJson = seatRes.ok ? ((await seatRes.json()) as unknown) : null;
    const seatSummary = readArrayPayload<ApiSeatSummary>(seatJson)[0];

    // Match Dhaka Tribune seat list first, then use its internal id for candidates.
    let resolvedCandidateSourceId = id;
    const seatListRes = await fetch("https://election.dhakatribune.com/get-seats/3", { cache: "no-store" });
    if (seatListRes.ok) {
      const seatListJson = (await seatListRes.json()) as unknown;
      const seatRows = readArrayPayload<ApiSeatListEntry>(seatListJson);
      const matchedSeat = seatRows.find((row) => String(row.seat_no ?? "") === id);
      if (matchedSeat?.id !== undefined && matchedSeat.id !== null) {
        resolvedCandidateSourceId = String(matchedSeat.id);
      }
    }

    let candidates: ApiCandidate[] = [];
    let rawCandidateHtml: string | undefined;
    const candidateRes = await fetch(`https://election.dhakatribune.com/get-candidate/${resolvedCandidateSourceId}`, {
      cache: "no-store",
    });
    if (candidateRes.ok) {
      const raw = await candidateRes.text();
      if (raw.includes("dt-s-candidate-content")) {
        rawCandidateHtml = raw;
      }

      try {
        const candidateJson = JSON.parse(raw) as unknown;
        candidates = readArrayPayload<ApiCandidate>(candidateJson).map((row) => ({
          ...row,
          vote: parseNumeric(row.vote),
          candidate_image:
            absolutizeTribuneAsset(
              typeof row.image === "string" ? row.image : typeof row.candidate_image === "string" ? row.candidate_image : undefined,
              "candidate",
            ) ?? undefined,
          party_image:
            absolutizeTribuneAsset(
              typeof row.logo === "string" ? row.logo : typeof row.party_image === "string" ? row.party_image : undefined,
              "party",
            ) ?? undefined,
        }));
      } catch {
        // Some responses are HTML card blocks; parse image/name/vote/center/percentage.
        const blocks = raw.match(/<div class="col-lg-12 mt-5 text-center">[\s\S]*?<\/div>\s*<\/div>/g) ?? [];
        candidates = blocks.map((block) => {
          const candidateImage =
            block.match(/src="(\.\/upload\/candidate\/[^"]+)"/)?.[1] ??
            block.match(/src="(https?:\/\/[^"]*\/upload\/candidate\/[^"]+)"/)?.[1];
          const partyImage =
            block.match(/src="(\.\/upload\/party\/[^"]+)"/)?.[1] ??
            block.match(/src="(https?:\/\/[^"]*\/upload\/party\/[^"]+)"/)?.[1];
          const name =
            block.match(/<h4[^>]*>([^<]+)<\/h4>/)?.[1]?.trim() ??
            block.match(/<h3[^>]*>([^<]+)<\/h3>/)?.[1]?.trim() ??
            "-";
          const voteText =
            block.match(/Total Vote:\s*<span[^>]*>([\d,]+)<\/span>/i)?.[1] ??
            block.match(/Total Vote:\s*([\d,]+)/i)?.[1] ??
            "0";
          const centerText =
            block.match(/Center:\s*<span[^>]*>([\d,]+)<\/span>/i)?.[1] ??
            block.match(/Center:\s*([\d,]+)/i)?.[1];
          const percentText =
            block.match(/<\/div>\s*([\d.]+)%\s*<\/div>/)?.[1] ??
            block.match(/width:\s*([\d.]+)%/i)?.[1];

          return {
            candidate_name: name,
            vote: parseNumeric(voteText),
            center: centerText ? parseNumeric(centerText) : undefined,
            percentage: percentText ? parseNumeric(percentText) : undefined,
            candidate_image: absolutizeTribuneAsset(candidateImage, "candidate") ?? undefined,
            party_image: absolutizeTribuneAsset(partyImage, "party") ?? undefined,
          } satisfies ApiCandidate;
        });
      }
    }

    candidates = candidates.sort((a, b) => parseNumeric(b.vote) - parseNumeric(a.vote));

    return { seatSummary, candidates, rawCandidateHtml, source: "live" };
  } catch {
    return { candidates: [], source: "live" };
  }
}

async function getLocalSeatData(id: string): Promise<SeatData> {
  const baseDir = path.join(process.cwd(), "frontend", "src", "data", "dhakatribune");
  try {
    const [homeRaw, candidateRaw] = await Promise.all([
      readFile(path.join(baseDir, `seat-${id}-home.raw`), "utf8"),
      readFile(path.join(baseDir, `seat-${id}-candidate.raw`), "utf8"),
    ]);

    let seatSummary: ApiSeatSummary | undefined;
    try {
      const seatJson = JSON.parse(homeRaw) as unknown;
      seatSummary = readArrayPayload<ApiSeatSummary>(seatJson)[0];
    } catch {
      seatSummary = undefined;
    }

    let candidates: ApiCandidate[] = [];
    let rawCandidateHtml: string | undefined;
    if (candidateRaw.includes("dt-s-candidate-content")) {
      rawCandidateHtml = candidateRaw;
    }
    try {
      const candidateJson = JSON.parse(candidateRaw) as unknown;
      candidates = readArrayPayload<ApiCandidate>(candidateJson)
        .map((row) => ({
          ...row,
          vote: parseNumeric(row.vote),
          candidate_image:
            absolutizeTribuneAsset(
              typeof row.image === "string" ? row.image : typeof row.candidate_image === "string" ? row.candidate_image : undefined,
              "candidate",
            ) ?? undefined,
          party_image:
            absolutizeTribuneAsset(
              typeof row.logo === "string" ? row.logo : typeof row.party_image === "string" ? row.party_image : undefined,
              "party",
            ) ?? undefined,
        }))
        .sort((a, b) => parseNumeric(b.vote) - parseNumeric(a.vote));
    } catch {
      candidates = [];
    }

    return { seatSummary, candidates, rawCandidateHtml, source: "local" };
  } catch {
    return { candidates: [], source: "local" };
  }
}

async function resolveSeatData(id: string): Promise<SeatData> {
  const mode = (process.env.DHAKA_DATA_SOURCE ?? "auto").toLowerCase();

  if (mode === "local") {
    return getLocalSeatData(id);
  }

  if (mode === "live") {
    const live = await getLiveSeatData(id);
    if (hasUsableData(live)) return live;
    return getLocalSeatData(id);
  }

  const live = await getLiveSeatData(id);
  if (hasUsableData(live)) return live;
  return getLocalSeatData(id);
}

export default async function ConstituencyPage({ params }: ConstituencyPageProps) {
  const { id } = await params;
  const constituencyName = SEAT_TO_CONSTITUENCY[id] ?? `Constituency ${id}`;
  const details = CONSTITUENCY_DETAILS[constituencyName] ?? "No ward details added yet.";
  const seatData = await resolveSeatData(id);
  const voterCount = seatData.seatSummary?.total_voter
    ? formatNumber(seatData.seatSummary.total_voter)
    : CONSTITUENCY_VOTERS[constituencyName] ?? "To be added";
  const history = (CONSTITUENCY_HISTORY[constituencyName] ?? []).map((entry) => ({
    ...entry,
    winner: seatData.seatSummary?.winer_name ?? seatData.seatSummary?.winner_name ?? entry.winner,
    party: seatData.seatSummary?.winer_league ?? seatData.seatSummary?.winner_league ?? entry.party,
  }));
  const totalCandidateVotes = seatData.candidates.reduce((sum, row) => sum + parseNumeric(row.vote), 0);
  const totalVoters = parseNumeric(seatData.seatSummary?.total_voter);
  const seatCenter = seatData.seatSummary?.total_center ?? seatData.seatSummary?.center;
  const tribuneEmbedHtml = seatData.rawCandidateHtml?.includes("dt-s-candidate-content")
    ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="https://election.dhakatribune.com/" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
    <style>body{margin:0;padding:16px;background:#fff;}</style>
  </head>
  <body>${seatData.rawCandidateHtml}</body>
</html>`
    : null;

  return (
    <section className="h-full w-full overflow-y-auto bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-50 to-white p-6 text-center shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Constituency
            </span>
            <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold tracking-wide text-gray-700">
              Seat {id}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">{constituencyName}</h1>
          <p className="mx-auto mt-3 max-w-3xl text-base text-gray-700">{details}</p>
          <p className="mt-2 text-base font-semibold text-gray-800">
            Total Voters: <span className="text-indigo-700">{voterCount}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Source: election.dhakatribune.com ({seatData.source === "live" ? "live" : "local snapshot"})
          </p>
        </header>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Candidate Vote Results</h2>
          </div>
          {seatData.candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Candidate</th>
                    <th className="px-4 py-3 font-semibold">Party</th>
                    <th className="px-4 py-3 font-semibold">Center</th>
                    <th className="px-4 py-3 font-semibold">Votes</th>
                    <th className="px-4 py-3 font-semibold">% of Total Voter</th>
                  </tr>
                </thead>
                <tbody>
                  {seatData.candidates.map((candidate, index) => {
                    const candidateName = (candidate.candidate_name ?? candidate.name ?? "-").toString();
                    const candidateVotes = parseNumeric(candidate.vote);
                    const percent =
                      totalVoters > 0
                        ? (candidateVotes / totalVoters) * 100
                        : totalCandidateVotes > 0
                          ? (candidateVotes / totalCandidateVotes) * 100
                          : 0;
                    const candidateImage =
                      typeof candidate.candidate_image === "string"
                        ? candidate.candidate_image
                        : absolutizeTribuneAsset(
                            typeof candidate.image === "string" ? candidate.image : undefined,
                            "candidate",
                          );
                    const partyImage =
                      typeof candidate.party_image === "string"
                        ? candidate.party_image
                        : absolutizeTribuneAsset(typeof candidate.logo === "string" ? candidate.logo : undefined, "party");
                    const centerCount = candidate.center ?? seatCenter;

                    return (
                      <tr key={`${candidate.id ?? candidateName}-${index}`} className="border-t border-gray-100 align-middle">
                        <td className="px-4 py-3 font-semibold text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {candidateImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={candidateImage}
                                alt={candidateName}
                                className="h-10 w-10 rounded object-cover ring-1 ring-gray-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-100" />
                            )}
                            <span className="font-medium text-gray-900">{candidateName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {partyImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={partyImage}
                                alt={`${candidate.league?.toString() ?? "Party"} logo`}
                                className="h-8 w-8 rounded object-contain"
                                loading="lazy"
                              />
                            ) : null}
                            <span className="text-gray-700">{candidate.league?.toString() ?? "-"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{formatNumber(centerCount)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(candidateVotes)}</td>
                        <td className="px-4 py-3">
                          <div className="w-44">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-indigo-600"
                                style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                              />
                            </div>
                            <p className="mt-1 text-right text-xs font-semibold text-gray-700">{percent.toFixed(2)}%</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : tribuneEmbedHtml ? (
            <div className="h-[720px] w-full overflow-hidden">
              <iframe
                srcDoc={tribuneEmbedHtml}
                className="h-full w-full"
                title={`${constituencyName} candidate results`}
                loading="lazy"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-600">Live constituency block is not available right now.</p>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Election History</h2>
          </div>

          {history.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-600">No election results added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Year</th>
                    <th className="px-5 py-3 font-semibold">Election</th>
                    <th className="px-5 py-3 font-semibold">Winner</th>
                    <th className="px-5 py-3 font-semibold">Party</th>
                    <th className="px-5 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={`${entry.year}-${entry.election}`} className="border-t border-gray-100">
                      <td className="px-5 py-3 text-gray-900">{entry.year}</td>
                      <td className="px-5 py-3 text-gray-700">{entry.election}</td>
                      <td className="px-5 py-3 text-gray-700">{entry.winner}</td>
                      <td className="px-5 py-3 text-gray-700">{entry.party}</td>
                      <td className="px-5 py-3 text-gray-700">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Constituency Map Focus</h2>
          <div className="mt-4 h-[420px] w-full overflow-hidden rounded-lg border border-gray-200">
            <iframe
              src={`/constituency-map-viewer.html?seat=${encodeURIComponent(id)}`}
              className="h-full w-full"
              title={`${constituencyName} map focus`}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
