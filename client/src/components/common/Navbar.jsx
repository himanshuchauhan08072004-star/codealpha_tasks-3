import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import ThemeToggle from './ThemeToggle';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Beauty', 'Sports'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight shrink-0">
          ShopSphere
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full bg-white/10 px-4 py-2 pr-10 text-sm text-white placeholder-white/60 outline-none focus:bg-white/20"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search size={16} />
            </button>
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[10px] font-semibold text-navy">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm hover:text-amber">
                  Dashboard
                </Link>
              )}
              <Link to="/orders" className="text-sm hover:text-amber">
                My Orders
              </Link>
              <Link to="/profile" aria-label="Profile">
                <User size={20} />
              </Link>
              <button onClick={logout} className="text-sm hover:text-amber">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm hover:text-amber">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-amber px-4 py-1.5 text-sm font-medium text-navy hover:bg-amber-dark">
                Sign up
              </Link>
            </div>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-white/10 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-2 text-sm lg:px-8">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-amber">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/60 outline-none"
            />
          </form>

          <div className="flex flex-col gap-3 text-sm">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setMenuOpen(false)}>
                {cat}
              </Link>
            ))}
            <hr className="border-white/10" />
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <Link to="/orders" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={logout} className="text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
