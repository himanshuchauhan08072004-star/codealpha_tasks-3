export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink/60">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
