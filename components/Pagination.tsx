import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
  basePath?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  query = '',
  basePath = '/meetings',
}: PaginationProps) {
  // Con una sola página no hace falta mostrar nada
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  }

  const linkClass = 'rounded border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100';
  const disabledClass = 'rounded border border-gray-200 px-4 py-2 text-gray-400';

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Previous
        </span>
      )}

      <span aria-current="page" className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
}
