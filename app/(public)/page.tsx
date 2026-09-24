import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const meetings = await getMeetings(query, currentPage);
  const totalPages = await getMeetingsTotalPages(query);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sacrament Meeting Planner</h1>

      {/* Barra de búsqueda simple */}
      <form className="mb-6">
        <input
          type="text"
          name="query"
          placeholder="Buscar por presidencia, discursante..."
          defaultValue={query}
          className="border p-2 rounded w-full max-w-md"
        />
        <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </form>

      {/* Lista de reuniones */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border p-4 rounded shadow">
            <p><strong>Fecha:</strong> {meeting.date}</p>
            <p><strong>Tipo:</strong> {meeting.meetingType}</p>
            <p><strong>Preside:</strong> {meeting.presiding}</p>
            <p><strong>Dirige:</strong> {meeting.conducting}</p>
            <Link href={`/meetings/${meeting.id}`} className="text-blue-600 underline mt-2 inline-block">
              Ver detalles
            </Link>
          </div>
        ))}
        {meetings.length === 0 && (
          <p>No se encontraron reuniones.</p>
        )}
      </div>

      {/* Paginación simple */}
      <div className="flex gap-4 mt-6 items-center">
        {currentPage > 1 && (
          <Link
            href={`/?query=${query}&page=${currentPage - 1}`}
            className="px-4 py-2 border rounded"
          >
            Anterior
          </Link>
        )}
        <span>Página {currentPage} de {totalPages || 1}</span>
        {currentPage < totalPages && (
          <Link
            href={`/?query=${query}&page=${currentPage + 1}`}
            className="px-4 py-2 border rounded"
          >
            Siguiente
          </Link>
        )}
      </div>
    </main>
  );
}