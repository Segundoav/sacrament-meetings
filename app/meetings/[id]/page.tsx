import { getMeetingById, getMeetings } from '@/lib/meetings-db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const meetingId = parseInt(resolvedParams.id, 10);
  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Back to Meetings List
          </Link>
        </div>

        <div className="bg-white shadow rounded-xl p-8 border border-gray-100">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {meeting.meetingType} Meeting
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Date: {meeting.date}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500 font-medium">Presiding</p>
              <p className="text-gray-800 font-semibold">{meeting.presiding}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Conducting</p>
              <p className="text-gray-800 font-semibold">{meeting.conducting}</p>
            </div>
          </div>

          {/* Announcements */}
          {meeting.announcements && meeting.announcements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Announcements</h2>
              <ul className="list-disc list-inside bg-blue-50/50 border border-blue-100 p-4 rounded-lg space-y-1 text-gray-700">
                {meeting.announcements.map((announcement, index) => (
                  <li key={index}>{announcement}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <Link
                href={`/meetings/${meeting.id}/edit`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
                Edit Meeting
            </Link>
          </div>



          {/* Program Order */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Meeting Program</h2>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Opening Hymn</span>
              <span className="text-gray-900">#{meeting.openingHymn.number} - {meeting.openingHymn.title}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Opening Prayer</span>
              <span className="text-gray-900">{meeting.openingPrayer}</span>
            </div>

            {meeting.wardBusiness.length > 0 && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium block mb-1">Ward Business</span>
                <ul className="list-disc list-inside text-gray-800 text-sm pl-2">
                  {meeting.wardBusiness.map((business, index) => (
                    <li key={index}>{business.description}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Sacrament Hymn</span>
              <span className="text-gray-900">#{meeting.sacramentHymn.number} - {meeting.sacramentHymn.title}</span>
            </div>

            {/* Speakers / Program Items */}
            <div className="py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium block mb-2">Speakers & Presentations</span>
              <div className="space-y-3 pl-2">
                {meeting.speakers.map((speaker, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{speaker.name}</p>
                    <p className="text-xs text-gray-500 italic">Topic: {speaker.topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Closing Hymn</span>
              <span className="text-gray-900">#{meeting.closingHymn.number} - {meeting.closingHymn.title}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Closing Prayer</span>
              <span className="text-gray-900">{meeting.closingPrayer}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Opcional: Generar rutas estáticas si se requiere para exportación
export function generateStaticParams() {
  const meetings = getMeetings();
  return meetings.map((meeting) => ({
    id: meeting.id.toString(),
  }));
}