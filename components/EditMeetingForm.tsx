'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { MeetingType, SacramentMeeting } from '@/lib/types';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

type FormState = {
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
};

// Un himno tiene dos campos: número y título
function HymnFields({
  label,
  idPrefix,
  number,
  title,
  onNumber,
  onTitle,
}: {
  label: string;
  idPrefix: string;
  number: string;
  title: string;
  onNumber: (value: string) => void;
  onTitle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <label htmlFor={`${idPrefix}-number`} className={labelClass}>
          {label} #
        </label>
        <input
          id={`${idPrefix}-number`}
          type="number"
          min={1}
          required
          value={number}
          onChange={(e) => onNumber(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="col-span-2">
        <label htmlFor={`${idPrefix}-title`} className={labelClass}>
          {label} Title
        </label>
        <input
          id={`${idPrefix}-title`}
          type="text"
          required
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function EditMeetingForm({ meeting }: { meeting: SacramentMeeting }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Todos los campos del formulario viven en un solo objeto
  const [form, setForm] = useState<FormState>({
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  });

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // El formulario no habla con la base de datos: le pide a la API que guarde
      const response = await fetch(`/api/meetings/${meeting.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          meetingType: form.meetingType,
          presiding: form.presiding,
          conducting: form.conducting,
          openingHymn: { number: Number(form.openingHymnNumber), title: form.openingHymnTitle },
          openingPrayer: form.openingPrayer,
          sacramentHymn: { number: Number(form.sacramentHymnNumber), title: form.sacramentHymnTitle },
          closingHymn: { number: Number(form.closingHymnNumber), title: form.closingHymnTitle },
          closingPrayer: form.closingPrayer,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? 'Could not save the changes. Please try again.');
        setSaving(false);
        return;
      }

      router.push(`/meetings/${meeting.id}`);
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className={labelClass}>Date</label>
        <input
          id="date"
          type="date"
          required
          value={form.date}
          onChange={(e) => setField('date', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="meetingType" className={labelClass}>Meeting Type</label>
        <select
          id="meetingType"
          value={form.meetingType}
          onChange={(e) => setField('meetingType', e.target.value as MeetingType)}
          className={inputClass}
        >
          <option value="regular">Regular Meeting</option>
          <option value="testimony">Testimony Meeting</option>
          <option value="stake">Stake Conference</option>
          <option value="general">General Conference</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="presiding" className={labelClass}>Presiding</label>
          <input
            id="presiding"
            type="text"
            required
            value={form.presiding}
            onChange={(e) => setField('presiding', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="conducting" className={labelClass}>Conducting</label>
          <input
            id="conducting"
            type="text"
            value={form.conducting}
            onChange={(e) => setField('conducting', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <HymnFields
        label="Opening Hymn"
        idPrefix="opening-hymn"
        number={form.openingHymnNumber}
        title={form.openingHymnTitle}
        onNumber={(v) => setField('openingHymnNumber', v)}
        onTitle={(v) => setField('openingHymnTitle', v)}
      />

      <div>
        <label htmlFor="openingPrayer" className={labelClass}>Opening Prayer</label>
        <input
          id="openingPrayer"
          type="text"
          required
          value={form.openingPrayer}
          onChange={(e) => setField('openingPrayer', e.target.value)}
          className={inputClass}
        />
      </div>

      <HymnFields
        label="Sacrament Hymn"
        idPrefix="sacrament-hymn"
        number={form.sacramentHymnNumber}
        title={form.sacramentHymnTitle}
        onNumber={(v) => setField('sacramentHymnNumber', v)}
        onTitle={(v) => setField('sacramentHymnTitle', v)}
      />

      <HymnFields
        label="Closing Hymn"
        idPrefix="closing-hymn"
        number={form.closingHymnNumber}
        title={form.closingHymnTitle}
        onNumber={(v) => setField('closingHymnNumber', v)}
        onTitle={(v) => setField('closingHymnTitle', v)}
      />

      <div>
        <label htmlFor="closingPrayer" className={labelClass}>Closing Prayer</label>
        <input
          id="closingPrayer"
          type="text"
          required
          value={form.closingPrayer}
          onChange={(e) => setField('closingPrayer', e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}