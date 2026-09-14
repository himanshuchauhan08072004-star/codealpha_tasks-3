import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => setLocal(value || ''), [value]);

  return (
    <div className="relative">
      <input
        type="search"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink/20 bg-surface px-4 py-2 pr-10 text-sm text-ink outline-none focus:border-amber"
      />
      <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40" />
    </div>
  );
}
