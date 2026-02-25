interface ConstituencyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstituencyPage({ params }: ConstituencyPageProps) {
  const { id } = await params;

  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Constituency {id}</h1>
    </div>
  );
}
