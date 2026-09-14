import { useForm } from 'react-hook-form';

const inputClass =
  'w-full rounded-md border border-ink/20 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber';
const labelClass = 'mb-1 block text-sm font-medium';
const errorClass = 'mt-1 text-xs text-red-600';

export default function CheckoutForm({ onSubmit, submitting, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Customer Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Full name</label>
            <input className={inputClass} {...register('customerInfo.fullName', { required: 'Full name is required' })} />
            {errors.customerInfo?.fullName && <p className={errorClass}>{errors.customerInfo.fullName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              {...register('customerInfo.email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />
            {errors.customerInfo?.email && <p className={errorClass}>{errors.customerInfo.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} {...register('customerInfo.phone', { required: 'Phone is required' })} />
            {errors.customerInfo?.phone && <p className={errorClass}>{errors.customerInfo.phone.message}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Shipping Address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <input className={inputClass} {...register('shippingAddress.address', { required: 'Address is required' })} />
            {errors.shippingAddress?.address && <p className={errorClass}>{errors.shippingAddress.address.message}</p>}
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} {...register('shippingAddress.city', { required: 'City is required' })} />
            {errors.shippingAddress?.city && <p className={errorClass}>{errors.shippingAddress.city.message}</p>}
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input className={inputClass} {...register('shippingAddress.state', { required: 'State is required' })} />
            {errors.shippingAddress?.state && <p className={errorClass}>{errors.shippingAddress.state.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Postal code</label>
            <input className={inputClass} {...register('shippingAddress.postalCode', { required: 'Postal code is required' })} />
            {errors.shippingAddress?.postalCode && <p className={errorClass}>{errors.shippingAddress.postalCode.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} {...register('shippingAddress.country', { required: 'Country is required' })} />
            {errors.shippingAddress?.country && <p className={errorClass}>{errors.shippingAddress.country.message}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Payment</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-3 rounded-md border border-ink/20 p-3 text-sm">
            <input type="radio" value="COD" defaultChecked {...register('paymentMethod')} />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-3 rounded-md border border-ink/20 p-3 text-sm">
            <input type="radio" value="mock" {...register('paymentMethod')} />
            Mock card payment (demo only, no real charge)
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-navy py-3 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
      >
        {submitting ? 'Placing order...' : 'Place Order'}
      </button>
    </form>
  );
}
