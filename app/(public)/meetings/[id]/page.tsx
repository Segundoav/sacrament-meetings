import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';

const MAX_ID = 2147483647; // el máximo de una columna SERIAL en PostgreSQL

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // En esta versión de Next.js, params es una Promise: hay que usar await
  const { id } = await params;
  const meetingId = Number(id);
  if (!/^\d+$/.test(id) || meetingId < 1 || meetingId > MAX_ID) notFound();

  // getMeetingById consulta la base de datos, así que hay que esperarla con await
  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  const announcements = meeting.announcements ?? [];
  const wardBusiness = meeting.wardBusiness ?? [];
  const speakers = meeting.speakers ?? [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/meetings" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to meetings
        </Link>
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit meeting
        </Link>
      </div>

      <article className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <header className="mb-6 border-b border-gray-100 pb-6">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-blue-700">
            {meeting.meetingType}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{meeting.date}</h1>
          <p className="mt-1 text-gray-700">Presiding: {meeting.presiding}</p>
          <p className="text-gray-700">
            Conducting: {meeting.conducting || 'Not assigned'}
          </p>
        </header>

        {announcements.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Announcements</h2>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              {announcements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Opening</h2>
          <p className="text-gray-700">
            Hymn: #{meeting.openingHymn.number} {meeting.openingHymn.title}
          </p>
          <p className="text-gray-700">Prayer: {meeting.openingPrayer}</p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Ward business</h2>
          {wardBusiness.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              {wardBusiness.map((item, index) => (
                <li key={index}>{item.description}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No ward business.</p>
          )}
          {meeting.stakeBusiness && (
            <p className="mt-2 text-gray-700">Stake business will be presented.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Sacrament</h2>
          <p className="text-gray-700">
            Hymn: #{meeting.sacramentHymn.number} {meeting.sacramentHymn.title}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Speakers</h2>
          {speakers.length > 0 ? (
            <ul className="space-y-2 text-gray-700">
              {speakers.map((speaker, index) => (
                <li key={index}>
                  <span className="font-medium">{speaker.name}</span>
                  {speaker.type === 'musical-number' ? ' (musical number)' : ''}
                  {speaker.topic ? ` - ${speaker.topic}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No speakers scheduled.</p>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Closing</h2>
          <p className="text-gray-700">
            Hymn: #{meeting.closingHymn.number} {meeting.closingHymn.title}
          </p>
          <p className="text-gray-700">Prayer: {meeting.closingPrayer}</p>
        </section>
      </article>
    </main>
  );
}