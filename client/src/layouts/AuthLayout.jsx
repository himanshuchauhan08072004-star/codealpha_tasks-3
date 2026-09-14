import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <Link to="/" className="mb-8 font-display text-3xl font-semibold text-ink">
        ShopSphere
      </Link>
      <div className="w-full max-w-md rounded-lg border border-ink/10 bg-surface p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
