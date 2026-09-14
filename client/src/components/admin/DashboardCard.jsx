export default function DashboardCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{label}</p>
        {Icon && <Icon size={18} className={accent ? 'text-amber' : 'text-ink/40'} />}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
