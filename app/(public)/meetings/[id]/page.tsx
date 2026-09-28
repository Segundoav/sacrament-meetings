import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function MeetingsListPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  // Obtener reuniones filtradas y el total de páginas
  const meetings = await getMeetings(query, currentPage);
  const totalPages = await getMeetingsTotalPages(query);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sacrament Meeting Planner
        </h1>

        {/* Lista de reuniones */}
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No se encontraron reuniones.</p>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white p-4 rounded-lg shadow border">
                <p className="font-semibold">{meeting.date} - {meeting.meetingType}</p>
                <p className="text-sm text-gray-600">Preside: {meeting.presiding}</p>
                <Link href={`/meetings/${meeting.id}`} className="text-blue-600 text-sm hover:underline">
                  Ver detalles &rarr;
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}