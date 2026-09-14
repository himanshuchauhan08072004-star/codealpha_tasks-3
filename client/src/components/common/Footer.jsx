import { Link } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Beauty', 'Sports'];

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy-dark text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-white">ShopSphere</p>
          <p className="mt-2 text-sm">
            Everyday products, picked well. Electronics to home goods, shipped fast.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Shop</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-amber">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/orders" className="hover:text-amber">Order history</Link></li>
            <li><Link to="/profile" className="hover:text-amber">Profile</Link></li>
            <li><Link to="/cart" className="hover:text-amber">Cart</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Support</p>
          <ul className="space-y-2 text-sm">
            <li>help@shopsphere.example</li>
            <li>Mon–Fri, 9am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs lg:px-8">
        © {new Date().getFullYear()} ShopSphere. Built for demonstration purposes.
      </div>
    </footer>
  );
}
