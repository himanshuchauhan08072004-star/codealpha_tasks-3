import { useState, useEffect } from 'react';
import { Users, Package, ClipboardList, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDashboardStats } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import DashboardCard from '../../components/admin/DashboardCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Could not load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-ink/60">Could not load dashboard stats. Try refreshing.</p>;
  }

  const chartData = Object.entries(stats.ordersByStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <DashboardCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} accent />
        <DashboardCard label="Total Orders" value={stats.totalOrders} icon={ClipboardList} />
        <DashboardCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} />
        <DashboardCard label="Total Products" value={stats.totalProducts} icon={Package} />
        <DashboardCard label="Total Users" value={stats.totalUsers} icon={Users} />
        <DashboardCard label="Low Stock Items" value={stats.lowStockProducts.length} icon={AlertTriangle} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-surface p-5">
          <p className="mb-4 text-sm font-semibold text-ink">Orders by status</p>
          {chartData.length === 0 ? (
            <p className="text-sm text-ink/50">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#E8871E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border border-ink/10 bg-surface p-5">
          <p className="mb-4 text-sm font-semibold text-ink">Low stock products</p>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink/50">All products are well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStockProducts.map((p) => (
                <li key={p._id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="font-medium text-red-600">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
