import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to the Ward Sacrament Planner</h1>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600">
        Browse past and upcoming sacrament meeting programs, and find hymns,
        prayers, speakers and ward business in one place.
      </p>
      <Link
        href="/meetings"
        className="inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        View meetings
      </Link>
    </main>
  );
}