import { useForm } from 'react-hook-form';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Beauty', 'Sports'];
const inputClass = 'w-full rounded-md border border-ink/20 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber';
const labelClass = 'mb-1 block text-sm font-medium';
const errorClass = 'mt-1 text-xs text-red-600';

// Specs entered as "Key: Value" per line, parsed to an object on submit
const parseSpecs = (text) => {
  if (!text) return {};
  return text
    .split('\n')
    .map((line) => line.split(':'))
    .filter(([k, v]) => k && v)
    .reduce((acc, [k, ...rest]) => ({ ...acc, [k.trim()]: rest.join(':').trim() }), {});
};

const specsToText = (specs) =>
  specs ? Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '';

export default function ProductForm({ product, onSubmit, submitting, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product
      ? {
          ...product,
          images: product.images?.join(', ') || '',
          specificationsText: specsToText(product.specifications),
        }
      : { featured: false },
  });

  const submit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      stock: Number(data.stock),
      images: data.images.split(',').map((s) => s.trim()).filter(Boolean),
      specifications: parseSpecs(data.specificationsText),
      featured: !!data.featured,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className={labelClass}>Product name</label>
        <input className={inputClass} {...register('name', { required: 'Name is required' })} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={3} className={inputClass} {...register('description', { required: 'Description is required' })} />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price</label>
          <input type="number" step="0.01" min="0" className={inputClass} {...register('price', { required: 'Price is required', min: 0 })} />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Original price (optional)</label>
          <input type="number" step="0.01" min="0" className={inputClass} {...register('originalPrice', { min: 0 })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} {...register('category', { required: true })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input type="number" min="0" className={inputClass} {...register('stock', { required: 'Stock is required', min: 0 })} />
          {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Image URLs (comma-separated)</label>
        <input className={inputClass} placeholder="https://..., https://..." {...register('images', { required: 'At least one image URL is required' })} />
        {errors.images && <p className={errorClass}>{errors.images.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Specifications (optional, one "Key: Value" per line)</label>
        <textarea rows={3} className={inputClass} placeholder={'Color: Black\nWeight: 1.2kg'} {...register('specificationsText')} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('featured')} />
        Featured product
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-ink/20 px-4 py-2 text-sm font-medium hover:bg-bg">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60">
          {submitting ? 'Saving...' : product ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
