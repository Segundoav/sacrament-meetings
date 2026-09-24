import { getFilteredMeetings, getPagesCount } from '@/lib/meetings-db';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
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
  const meetings = await getFilteredMeetings(query, currentPage);
  const totalPages = await getPagesCount(query);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sacrament Meeting Planner
        </h1>

        {/* Componente de Búsqueda */}
        <MeetingSearch placeholder="Buscar por presidencia, discursante..." />

        {/* Lista de reuniones */}
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No se encontraron reuniones.</p>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white shadow rounded-xl p-6 border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {meeting.meetingType}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-2">Fecha: {meeting.date}</p>
                  <p className="text-sm text-gray-600">Preside: {meeting.presiding}</p>
                  <p className="text-sm text-gray-600">Dirige: {meeting.conducting}</p>
                </div>
                <div>
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Componente de Paginación */}
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}