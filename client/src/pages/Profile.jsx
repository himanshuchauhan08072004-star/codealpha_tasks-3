import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { updateUserProfile } from '../services/authService';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user?.name || '', avatar: user?.avatar || '' },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await updateUserProfile(data);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 font-display text-2xl font-semibold">Profile</h1>

      <div className="rounded-lg border border-ink/10 bg-surface p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-navy/10 text-xl font-semibold text-ink">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-ink/60">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium capitalize text-ink">
              {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t border-ink/10 pt-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              className="w-full rounded-md border border-ink/20 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Avatar URL (optional)</label>
            <input
              className="w-full rounded-md border border-ink/20 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              placeholder="https://..."
              {...register('avatar')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              disabled
              value={user.email}
              className="w-full cursor-not-allowed rounded-md border border-ink/10 bg-bg px-3 py-2 text-sm text-ink/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !isDirty}
            className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      <button
        onClick={logout}
        className="mt-6 rounded-md border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink hover:bg-bg"
      >
        Log out
      </button>
    </div>
  );
}
