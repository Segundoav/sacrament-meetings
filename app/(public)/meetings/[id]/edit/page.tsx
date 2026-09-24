'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMeetingById, updateMeeting } from '@/lib/meetings-db';
import { MeetingType } from '@/lib/types';
import Link from 'next/link';

export default function EditMeetingPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [date, setDate] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('regular');
  const [presiding, setPresiding] = useState('');
  const [conducting, setConducting] = useState('');
  const [openingHymnNumber, setOpeningHymnNumber] = useState('');
  const [openingHymnTitle, setOpeningHymnTitle] = useState('');
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [sacramentHymnNumber, setSacramentHymnNumber] = useState('');
  const [sacramentHymnTitle, setSacramentHymnTitle] = useState('');
  const [closingHymnNumber, setClosingHymnNumber] = useState('');
  const [closingHymnTitle, setClosingHymnTitle] = useState('');
  const [closingPrayer, setClosingPrayer] = useState('');

  useEffect(() => {
    if (id) {
      const meeting = getMeetingById(Number(id));
      if (meeting) {
        setDate(meeting.date);
        setMeetingType(meeting.meetingType);
        setPresiding(meeting.presiding);
        setConducting(meeting.conducting);
        setOpeningHymnNumber(meeting.openingHymn.number.toString());
        setOpeningHymnTitle(meeting.openingHymn.title);
        setOpeningPrayer(meeting.openingPrayer);
        setSacramentHymnNumber(meeting.sacramentHymn.number.toString());
        setSacramentHymnTitle(meeting.sacramentHymn.title);
        setClosingHymnNumber(meeting.closingHymn.number.toString());
        setClosingHymnTitle(meeting.closingHymn.title);
        setClosingPrayer(meeting.closingPrayer);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMeeting(id, {
      date,
      meetingType,
      presiding,
      conducting,
      openingHymn: { number: Number(openingHymnNumber), title: openingHymnTitle },
      openingPrayer,
      sacramentHymn: { number: Number(sacramentHymnNumber), title: sacramentHymnTitle },
      closingHymn: { number: Number(closingHymnNumber), title: closingHymnTitle },
      closingPrayer,
    });

    router.push(`/meetings/${id}`);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/meetings/${id}`} className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Back to Meeting Details
          </Link>
        </div>

        <div className="bg-white shadow rounded-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Sacrament Meeting</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="regular">Regular Meeting</option>
                <option value="testimony">Testimony Meeting</option>
                <option value="stake-conference">Stake Conference</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presiding</label>
                <input
                  type="text"
                  required
                  value={presiding}
                  onChange={(e) => setPresiding(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conducting</label>
                <input
                  type="text"
                  required
                  value={conducting}
                  onChange={(e) => setConducting(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Opening Hymn */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hymn #</label>
                <input
                  type="number"
                  required
                  value={openingHymnNumber}
                  onChange={(e) => setOpeningHymnNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hymn Title</label>
                <input
                  type="text"
                  required
                  value={openingHymnTitle}
                  onChange={(e) => setOpeningHymnTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Prayer</label>
              <input
                type="text"
                required
                value={openingPrayer}
                onChange={(e) => setOpeningPrayer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sacrament Hymn */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sacrament Hymn #</label>
                <input
                  type="number"
                  required
                  value={sacramentHymnNumber}
                  onChange={(e) => setSacramentHymnNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sacrament Hymn Title</label>
                <input
                  type="text"
                  required
                  value={sacramentHymnTitle}
                  onChange={(e) => setSacramentHymnTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Closing Hymn */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Hymn #</label>
                <input
                  type="number"
                  required
                  value={closingHymnNumber}
                  onChange={(e) => setClosingHymnNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Hymn Title</label>
                <input
                  type="text"
                  required
                  value={closingHymnTitle}
                  onChange={(e) => setClosingHymnTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Prayer</label>
              <input
                type="text"
                required
                value={closingPrayer}
                onChange={(e) => setClosingPrayer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}