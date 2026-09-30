'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function MeetingSearch({
  placeholder = 'Search by presiding, conducting, type or speaker',
}: {
  placeholder?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpia el temporizador si el componente desaparece
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleSearch(term: string) {
    // Espera 300 ms después de que la persona deja de escribir (evita una consulta por letra)
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1'); // una búsqueda nueva siempre vuelve a la página 1
      if (term.trim()) {
        params.set('query', term.trim());
      } else {
        params.delete('query');
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="mb-6">
      <label htmlFor="meeting-search" className="mb-1 block text-sm font-medium text-gray-700">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString() ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
