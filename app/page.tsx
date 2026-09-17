import { getMeetings } from '@/lib/meetings-db';

export default function HomePage() {
  const meetings = getMeetings();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sacrament Meeting Planner</h1>
            <p className="text-gray-600 mt-1">Ward meeting management and organization</p>
          </div>
          <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition">
            New Meeting
          </span>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Scheduled Meetings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {meeting.meetingType}
                    </span>
                    <span className="text-sm text-gray-500">{meeting.date}</span>
                  </div>
                  <p className="text-gray-800 font-medium mt-2">
                    Presiding: {meeting.presiding} | Conducting: {meeting.conducting}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Opening Hymn: #{meeting.openingHymn.number} - {meeting.openingHymn.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                    View Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}