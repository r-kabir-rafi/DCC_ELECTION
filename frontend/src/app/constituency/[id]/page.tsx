interface ConstituencyPageProps {
  params: Promise<{ id: string }>;
}

const SEAT_TO_CONSTITUENCY: Record<string, string> = {
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

export default async function ConstituencyPage({ params }: ConstituencyPageProps) {
  const { id } = await params;
  const constituencyName = SEAT_TO_CONSTITUENCY[id] ?? `Constituency ${id}`;
  const details = CONSTITUENCY_DETAILS[constituencyName] ?? "No ward details added yet.";

  return (
    <div className="flex h-full w-full items-center justify-center bg-white px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{constituencyName}</h1>
        <p className="mt-4 text-base text-gray-700">{details}</p>
      </div>
    </div>
  );
}
