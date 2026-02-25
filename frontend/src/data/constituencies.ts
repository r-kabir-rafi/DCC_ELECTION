export const SEAT_TO_CONSTITUENCY: Record<string, string> = {
  "174": "Dhaka-1",
  "175": "Dhaka-2",
  "176": "Dhaka-3",
  "177": "Dhaka-4",
  "178": "Dhaka-5",
  "179": "Dhaka-6",
  "180": "Dhaka-7",
  "181": "Dhaka-8",
  "182": "Dhaka-9",
  "183": "Dhaka-10",
  "184": "Dhaka-11",
  "185": "Dhaka-12",
  "186": "Dhaka-13",
  "187": "Dhaka-14",
  "188": "Dhaka-15",
  "189": "Dhaka-16",
  "190": "Dhaka-17",
  "191": "Dhaka-18",
  "192": "Dhaka-19",
  "193": "Dhaka-20",
};

export type QuickNavZone = "DNCC" | "DSCC";

export const QUICK_NAV_OPTIONS: Record<QuickNavZone, Array<{ seatId: string; label: string }>> = {
  DNCC: [
    { seatId: "184", label: "Dhaka-11" },
    { seatId: "185", label: "Dhaka-12" },
    { seatId: "186", label: "Dhaka-13" },
    { seatId: "187", label: "Dhaka-14" },
    { seatId: "188", label: "Dhaka-15" },
    { seatId: "189", label: "Dhaka-16" },
    { seatId: "190", label: "Dhaka-17" },
    { seatId: "191", label: "Dhaka-18" },
  ],
  DSCC: [
    { seatId: "175", label: "Dhaka-2" },
    { seatId: "177", label: "Dhaka-4" },
    { seatId: "178", label: "Dhaka-5" },
    { seatId: "179", label: "Dhaka-6" },
    { seatId: "180", label: "Dhaka-7" },
    { seatId: "181", label: "Dhaka-8" },
    { seatId: "182", label: "Dhaka-9" },
    { seatId: "183", label: "Dhaka-10" },
  ],
};
