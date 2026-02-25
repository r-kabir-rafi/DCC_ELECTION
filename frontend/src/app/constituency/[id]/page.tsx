import { SEAT_TO_CONSTITUENCY } from "@/data/constituencies";

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
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return "To be added";
  return new Intl.NumberFormat("en-US").format(numeric);
}

function readArrayPayload<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as T[];
  }
  return [];
}

function resolveAssetUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const cleaned = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  const path = cleaned.replace(/^\.?\//, "");
  return `https://election.dhakatribune.com/${path}`;
}

function pickFirstString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function findImagePathByToken(source: Record<string, unknown>, token: string): string | undefined {
  for (const value of Object.values(source)) {
    if (typeof value !== "string") continue;
    if (value.includes(token)) return value;
  }
  return undefined;
}

async function getLiveSeatData(id: string): Promise<{
  seatSummary?: ApiSeatSummary;
  candidates: ApiCandidate[];
  rawCandidateHtml?: string;
}> {
  try {
    const [seatRes, candidateRes] = await Promise.all([
      fetch(`https://election.dhakatribune.com/get-home-seats/${id}`, { cache: "no-store" }),
      fetch(`https://election.dhakatribune.com/get-candidate/${id}`, { cache: "no-store" }),
    ]);

    const seatJson = seatRes.ok ? ((await seatRes.json()) as unknown) : null;
    const seatSummary = readArrayPayload<ApiSeatSummary>(seatJson)[0];

    let candidates: ApiCandidate[] = [];
    let rawCandidateHtml: string | undefined;
    if (candidateRes.ok) {
      const raw = await candidateRes.text();

      try {
        const candidateJson = JSON.parse(raw) as unknown;
        candidates = readArrayPayload<ApiCandidate>(candidateJson).map((row) => ({
          ...row,
          vote: Number(row.vote ?? 0),
        }));
      } catch {
        // Some seat responses can be HTML card blocks; parse image/name/vote/center/percentage from markup.
        rawCandidateHtml = raw;
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
            vote: Number(voteText.replace(/,/g, "")),
            center: centerText ? Number(centerText.replace(/,/g, "")) : undefined,
            percentage: percentText ? Number(percentText) : undefined,
            candidate_image: candidateImage,
            party_image: partyImage,
          } satisfies ApiCandidate;
        });
      }
    }

    candidates = candidates.sort((a, b) => Number(b.vote ?? 0) - Number(a.vote ?? 0));

    return { seatSummary, candidates, rawCandidateHtml };
  } catch {
    return { candidates: [] };
  }
}

export default async function ConstituencyPage({ params }: ConstituencyPageProps) {
  const { id } = await params;
  const constituencyName = SEAT_TO_CONSTITUENCY[id] ?? `Constituency ${id}`;
  const details = CONSTITUENCY_DETAILS[constituencyName] ?? "No ward details added yet.";
  const live = await getLiveSeatData(id);
  const voterCount = live.seatSummary?.total_voter
    ? formatNumber(live.seatSummary.total_voter)
    : CONSTITUENCY_VOTERS[constituencyName] ?? "To be added";
  const history = (CONSTITUENCY_HISTORY[constituencyName] ?? []).map((entry) => ({
    ...entry,
    winner: live.seatSummary?.winer_name ?? live.seatSummary?.winner_name ?? entry.winner,
    party: live.seatSummary?.winer_league ?? live.seatSummary?.winner_league ?? entry.party,
  }));
  const totalCandidateVotes = live.candidates.reduce((sum, row) => sum + Number(row.vote ?? 0), 0);
  const seatCenter = live.seatSummary?.total_center ?? live.seatSummary?.center;
  const tribuneEmbedHtml = live.rawCandidateHtml?.includes("dt-s-candidate-content")
    ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="https://election.dhakatribune.com/" />
    <style>
      body { font-family: Arial, sans-serif; margin: 0; background: #fff; padding: 12px; }
      .row { margin-left: 0; margin-right: 0; }
      .card { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; }
      img { max-width: 100%; height: auto; }
      .progress { background: #e5e7eb; border-radius: 9999px; overflow: hidden; min-height: 12px; }
      .progress-bar { background: #4f46e5; min-height: 12px; }
      .mt-5 { margin-top: 8px !important; }
      .text-center { text-align: left !important; }
    </style>
  </head>
  <body>${live.rawCandidateHtml}</body>
</html>`
    : null;

  return (
    <section className="h-full w-full overflow-y-auto bg-white px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Constituency
            </span>
            <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold tracking-wide text-gray-700">
              Seat {id}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">{constituencyName}</h1>
          <p className="mt-3 max-w-3xl text-base text-gray-700">{details}</p>
          <p className="mt-2 text-base font-semibold text-gray-800">
            Total Voters: <span className="text-indigo-700">{voterCount}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Live source: election.dhakatribune.com</p>
        </header>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Candidate Vote Results</h2>
          </div>
          {live.candidates.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-600">No candidate vote data available right now.</p>
          ) : (
            <div className="space-y-4 p-5">
              {live.candidates.map((candidate, index) => {
                const candidateName = candidate.candidate_name ?? candidate.name ?? "-";
                const candidateVotes = Number(candidate.vote ?? 0);
                const rawPercent = Number(candidate.percentage ?? candidate.vote_percentage ?? NaN);
                const computedPercent = totalCandidateVotes > 0 ? (candidateVotes / totalCandidateVotes) * 100 : 0;
                const percent = Number.isFinite(rawPercent) && rawPercent > 0 ? rawPercent : computedPercent;
                const candidateImageUrl = resolveAssetUrl(
                  pickFirstString(candidate, [
                    "candidate_image",
                    "candidate_img",
                    "candidate_photo",
                    "image",
                    "img",
                    "photo",
                  ]) ?? findImagePathByToken(candidate, "/upload/candidate/"),
                );
                const partyImageUrl = resolveAssetUrl(
                  pickFirstString(candidate, [
                    "party_image",
                    "party_img",
                    "party_logo",
                    "logo",
                    "symbol_image",
                    "symbol_img",
                  ]) ?? findImagePathByToken(candidate, "/upload/party/"),
                );
                const centerCount = candidate.center ?? seatCenter;

                return (
                  <div
                    key={`${candidate.id ?? candidateName}-${index}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[100px_1fr_72px_auto_160px]">
                      <div className="flex items-center justify-center">
                        {candidateImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={candidateImageUrl}
                            alt={candidateName}
                            className="h-20 w-20 rounded-md object-cover ring-1 ring-gray-200"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500">
                            No Photo
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rank #{index + 1}</p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">{candidateName}</h3>
                        <p className="text-sm text-gray-600">{candidate.league ?? "-"}</p>
                      </div>

                      <div className="flex items-center justify-center">
                        {partyImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={partyImageUrl}
                            alt={`${candidate.league ?? "Party"} logo`}
                            className="h-14 w-14 rounded object-contain"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-xs text-gray-500">No Logo</div>
                        )}
                      </div>

                      <div className="text-sm leading-6 text-gray-700">
                        <p>
                          Total Vote: <span className="font-semibold text-gray-900">{formatNumber(candidateVotes)}</span>
                        </p>
                        <p>
                          Center: <span className="font-semibold text-gray-900">{formatNumber(centerCount)}</span>
                        </p>
                      </div>

                      <div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                          />
                        </div>
                        <p className="mt-2 text-right text-sm font-semibold text-gray-700">{percent.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Dhaka Tribune Live Section</h2>
          <p className="mt-1 text-sm text-gray-600">
            Embedded candidate block for this constituency from election.dhakatribune.com.
          </p>
          {tribuneEmbedHtml ? (
            <div className="mt-4 h-[520px] w-full overflow-hidden rounded-lg border border-gray-200">
              <iframe
                srcDoc={tribuneEmbedHtml}
                className="h-full w-full"
                title={`${constituencyName} dhaka tribune section`}
                loading="lazy"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Live HTML block is not available for this seat right now.
            </p>
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
