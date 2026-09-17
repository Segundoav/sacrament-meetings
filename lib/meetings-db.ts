import { SacramentMeeting } from './types';

export const initialMeetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-09-20',
    meetingType: 'regular',
    presiding: 'Bishop Carlos Mendoza',
    conducting: 'First Counselor Juan Pérez',
    announcements: [
      'Temple recommend interviews will be held this Thursday.',
      'Youth service activity this Saturday at 9:00 a.m.'
    ],
    openingHymn: { number: 12, title: 'The Morning Breaks' },
    openingPrayer: 'Sister Maria Gómez',
    wardBusiness: [
      { description: 'Sustaining of new YSA activity committee members.' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 107, title: 'Lord, Accept Our True Devotion' },
    speakers: [
      { name: 'Brother Carlos Ruiz', topic: 'The Importance of Family Prayer', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Special Musical Number', type: 'musical-number' },
      { name: 'Sister Ana Torres', topic: 'Applying the Book of Mormon in Our Homes', type: 'speaker' }
    ],
    closingHymn: { number: 140, title: 'Awake, Ye Saints of God, Awake!' },
    closingPrayer: 'Brother Luis Silva'
  },
  {
    id: 2,
    date: '2026-09-27',
    meetingType: 'testimony',
    presiding: 'Bishop Carlos Mendoza',
    conducting: 'Bishop Carlos Mendoza',
    announcements: [
      'Fast Sunday is next week.'
    ],
    openingHymn: { number: 67, title: 'Glory to God on High' },
    openingPrayer: 'Brother Pedro Ramos',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 109, title: 'The Sacrament' },
    speakers: [
      { name: 'Open Testimony Meeting', topic: 'Expressing Gratitude and Testimonies', type: 'speaker' }
    ],
    closingHymn: { number: 137, title: 'Testimony' },
    closingPrayer: 'Sister Sofía Castro'
  }
];

let meetings = [...initialMeetings];

export function getMeetings(): SacramentMeeting[] {
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function addMeeting(newMeeting: Omit<SacramentMeeting, 'id'>): SacramentMeeting {
  const id = meetings.length > 0 ? Math.max(...meetings.map((m) => m.id)) + 1 : 1;
  const meeting: SacramentMeeting = { ...newMeeting, id };
  meetings.push(meeting);
  return meeting;
}

// Actualizar una reunión existente por su ID
export function updateMeeting(id: number, updatedData: Partial<SacramentMeeting>) {
  const index = meetings.findIndex((m) => m.id === id);
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updatedData };
  }
}