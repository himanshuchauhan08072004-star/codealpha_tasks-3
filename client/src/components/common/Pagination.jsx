export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-md px-3 py-1.5 text-sm disabled:opacity-30"
      >
        Prev
      </button>

      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-ink/40">…</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-md text-sm ${
              p === page ? 'bg-navy text-white' : 'text-ink hover:bg-navy/5'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-md px-3 py-1.5 text-sm disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  );
}
