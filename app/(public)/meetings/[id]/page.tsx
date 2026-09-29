import { getMeetings } from '@/lib/meetings-db';
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

  // Llamamos a getMeetings asegurando los parámetros correctos que espera la base de datos
  const meetings = await getMeetings(query, currentPage);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 shadow-sm py-4 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Ward Meetings Portal</h2>
            <h1 className="text-xl font-serif font-bold text-slate-800">Sacrament Meeting Planner</h1>
          </div>
          <Link
            href="/meetings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition shadow-sm"
          >
            + New Meeting
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold font-serif text-slate-900 mb-2">Scheduled Meetings</h3>
          <p className="text-slate-500 text-sm">Review, distribute, and manage active sacrament meeting programs.</p>
        </div>

        <form method="GET" className="mb-6 flex gap-2">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Search by speaker, leader, or meeting type..."
            className="flex-1 bg-white border border-slate-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Search
          </button>
        </form>

        <div className="space-y-4">
          {!meetings || meetings.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center text-slate-500">
              No meetings found.
            </div>
          ) : (
            meetings.map((meeting: any) => (
              <div key={meeting.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 uppercase tracking-wide">
                    {meeting.meetingType || meeting.type || 'REGULAR'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">#{meeting.id}</span>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {meeting.date}
                </h4>

                <div className="text-sm text-slate-600 space-y-1 mb-4">
                  <p><span className="font-medium text-slate-700">Presiding:</span> {meeting.presiding || '—'}</p>
                  <p><span className="font-medium text-slate-700">Conducting:</span> {meeting.conducting || '—'}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                  >
                    View Program &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}