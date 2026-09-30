import { Suspense } from 'react';
import Link from 'next/link';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  // En esta versión de Next.js, searchParams es una Promise: hay que usar await
  const params = await searchParams;
  const query = params?.query ?? '';
  const requestedPage = Number(params?.page);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const meetings = await getMeetings(query, currentPage);
  const totalPages = await getMeetingsTotalPages(query);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Meetings</h1>

      {/* useSearchParams necesita un Suspense alrededor */}
      <Suspense fallback={null}>
        <MeetingSearch />
      </Suspense>

      {meetings.length === 0 ? (
        <p className="rounded border border-gray-200 bg-white p-6 text-gray-600">
          No meetings match &ldquo;{query}&rdquo;. Try a different name or clear the search.
        </p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5"
            >
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-blue-700">
                    {meeting.meetingType}
                  </span>
                  <span className="text-gray-600">{meeting.date}</span>
                </div>
                <p>
                  Presiding: {meeting.presiding}
                  {meeting.conducting ? ` | Conducting: ${meeting.conducting}` : ''}
                </p>
                <p className="text-sm text-gray-500">
                  Opening hymn: #{meeting.openingHymn.number} {meeting.openingHymn.title}
                </p>
              </div>
              <Link
                href={`/meetings/${meeting.id}`}
                className="rounded bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                View details
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
    </main>
  );
}