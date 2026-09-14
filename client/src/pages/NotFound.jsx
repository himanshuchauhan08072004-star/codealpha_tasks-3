import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark">
        Back to home
      </Link>
    </div>
  );
}
