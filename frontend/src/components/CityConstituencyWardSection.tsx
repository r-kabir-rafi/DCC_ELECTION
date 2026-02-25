type Zone = "DNCC" | "DSCC";

type WardRow = {
  constituency: string;
  wards: string;
  areas?: string;
};

const DNCC_ROWS: WardRow[] = [
  { constituency: "Dhaka-11", wards: "21-23, 37, 38, 41, 42", areas: "Mirpur, Pallabi, Kafrul" },
  { constituency: "Dhaka-12", wards: "24-27, 35, 36", areas: "Sher-e-Bangla Nagar, Agargaon, Mohammadpur" },
  { constituency: "Dhaka-13", wards: "28-34", areas: "Adabor, Shyamoli, Mohammadpur" },
  { constituency: "Dhaka-14", wards: "7-12", areas: "Darus Salam, Shah Ali, Rupnagar, Savar (Kaundia)" },
  { constituency: "Dhaka-15", wards: "4, 13, 14, 16", areas: "Kafrul, Mirpur, Kazipara" },
  { constituency: "Dhaka-16", wards: "2, 3, 5, 6", areas: "Pallabi, Mirpur DOHS, ECB area" },
  { constituency: "Dhaka-17", wards: "15, 18-20, 39, 40", areas: "Banani, Gulshan, Niketan, Cantonment" },
  { constituency: "Dhaka-18", wards: "1, 17, 43-54", areas: "Uttara, Khilkhet, Badda, Airport" },
];

const DSCC_ROWS: WardRow[] = [
  {
    constituency: "Dhaka-2",
    wards: "55, 56, 57",
    areas: "Kamrangirchar, Sultanganj, Keraniganj, Amin Bazar",
  },
  { constituency: "Dhaka-4", wards: "47, 51-54", areas: "Shyampur, Kadamtali, Dolaipar" },
  { constituency: "Dhaka-5", wards: "48-50, 62-70", areas: "Jatrabari / Demra" },
  { constituency: "Dhaka-6", wards: "34, 37-46", areas: "Sutrapur / Gendaria / Wari" },
  { constituency: "Dhaka-7", wards: "23-33, 35, 36, 55-57", areas: "Lalbagh / Chawkbazar" },
  { constituency: "Dhaka-8", wards: "8-13, 19-21", areas: "Ramna / Motijheel / Paltan" },
  { constituency: "Dhaka-9", wards: "1-7, 71-75", areas: "Jigatola, Kalabagan, Matuail, Sarulia" },
  { constituency: "Dhaka-10", wards: "14-18, 22, 58-61", areas: "Dhanmondi, Hazaribagh, New Market, Kalabagan" },
];

export default function CityConstituencyWardSection({ zone }: { zone: Zone }) {
  const rows = zone === "DNCC" ? DNCC_ROWS : DSCC_ROWS;
  const title =
    zone === "DNCC"
      ? "DNCC Constituency & Ward Mapping"
      : "DSCC Constituency & Ward Mapping";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
          Wards
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Constituency-wise ward coverage inside this city corporation.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Constituency</th>
              <th className="px-4 py-3 font-semibold">Wards</th>
              <th className="px-4 py-3 font-semibold">Key Areas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.constituency} className="border-t border-gray-100 align-top transition-colors hover:bg-indigo-50/50">
                <td className="px-4 py-3 font-semibold text-gray-900">{row.constituency}</td>
                <td className="px-4 py-3 text-gray-700">{row.wards}</td>
                <td className="px-4 py-3 text-gray-700">{row.areas ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
