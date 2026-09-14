import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { handleImageError } from '../../utils/imageFallback';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ProductForm from '../../components/admin/ProductForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts({ limit: 50 })
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Could not load products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateProduct(editing._id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleting._id);
      toast.success('Product deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <LoadingSpinner size={28} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first product to get started." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink/10 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-bg text-xs uppercase text-ink/50">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink/5 last:border-0">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded object-cover" onError={handleImageError} />
                    <span className="line-clamp-1 font-medium">{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className={`px-4 py-3 ${p.stock <= 5 ? 'font-semibold text-red-600' : ''}`}>{p.stock}</td>
                  <td className="px-4 py-3">{p.featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="text-ink/60 hover:text-ink" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleting(p)} className="text-ink/60 hover:text-red-600" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit product' : 'Add product'}>
        <ProductForm product={editing} onSubmit={handleSubmit} submitting={submitting} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmationDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
