import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "election.dhakatribune.com";

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) return badRequest("Missing src");

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return badRequest("Invalid src URL");
  }

  if (url.hostname !== ALLOWED_HOST) {
    return badRequest("Host not allowed");
  }

  try {
    const upstream = await fetch(url.toString(), {
      headers: {
        Referer: "https://election.dhakatribune.com/seats",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const data = await upstream.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }
}
