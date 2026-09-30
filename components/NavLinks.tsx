'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/new', label: 'New Meeting' },
];

export default function NavLinks() {
  // usePathname() nos dice en qué página estamos, para marcar el enlace activo
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href === '/meetings/new') return pathname.startsWith('/meetings/new');
    // "Meetings" está activo en la lista y en el detalle, pero no en "New Meeting"
    return pathname.startsWith('/meetings') && !pathname.startsWith('/meetings/new');
  }

  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-5">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'border-b-2 border-blue-600 pb-1 font-semibold text-blue-700'
                    : 'pb-1 text-gray-600 hover:text-gray-900'
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
