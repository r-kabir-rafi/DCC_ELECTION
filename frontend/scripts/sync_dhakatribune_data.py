#!/usr/bin/env python3
import json
import urllib.request
from pathlib import Path

BASE = "https://election.dhakatribune.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Referer": f"{BASE}/seats",
    "Accept": "application/json,text/plain,*/*",
}
OUT_DIR = Path(__file__).resolve().parents[1] / "src" / "data" / "dhakatribune"


def fetch_text(path: str) -> str:
    req = urllib.request.Request(f"{BASE}{path}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read().decode("utf-8", "ignore")


def fetch_json(path: str):
    return json.loads(fetch_text(path))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    seats = fetch_json("/get-seats/3")

    dhaka_seats = []
    for seat in seats:
        try:
            seat_no = int(str(seat.get("seat_no")))
        except Exception:
            continue
        if 174 <= seat_no <= 193:
            dhaka_seats.append(seat)

    dhaka_seats.sort(key=lambda row: int(str(row["seat_no"])))

    index = []
    for seat in dhaka_seats:
        seat_no = str(seat["seat_no"])
        internal_id = str(seat["id"])

        home_raw = fetch_text(f"/get-home-seats/{seat_no}")
        candidate_raw = fetch_text(f"/get-candidate/{internal_id}")

        (OUT_DIR / f"seat-{seat_no}-home.raw").write_text(home_raw, encoding="utf-8")
        (OUT_DIR / f"seat-{seat_no}-candidate.raw").write_text(candidate_raw, encoding="utf-8")

        home_json = None
        candidate_json = None
        try:
            home_json = json.loads(home_raw)
            (OUT_DIR / f"seat-{seat_no}-home.json").write_text(
                json.dumps(home_json, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            pass

        try:
            candidate_json = json.loads(candidate_raw)
            (OUT_DIR / f"seat-{seat_no}-candidate.json").write_text(
                json.dumps(candidate_json, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            pass

        index.append(
            {
                "seat_no": seat_no,
                "internal_id": internal_id,
                "seat_name": seat.get("seat_name"),
                "total_voter": seat.get("total_voter"),
                "total_center": seat.get("total_center"),
                "home_is_json": home_json is not None,
                "candidate_is_json": candidate_json is not None,
            }
        )

    (OUT_DIR / "dhaka-seat-index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (OUT_DIR / "dhaka-seats-174-193.json").write_text(
        json.dumps(dhaka_seats, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Saved {len(dhaka_seats)} seats into {OUT_DIR}")


if __name__ == "__main__":
    main()
