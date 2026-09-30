import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';
import EditMeetingForm from '@/components/EditMeetingForm';

const MAX_ID = 2147483647; // el máximo de una columna SERIAL en PostgreSQL

export default async function EditMeetingPage({
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

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          &larr; Back to Meeting Details
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Sacrament Meeting</h1>
        <EditMeetingForm meeting={meeting} />
      </div>
    </main>
  );
}