import Modal from './Modal';

export default function ConfirmationDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink/70">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-md border border-ink/20 px-4 py-2 text-sm font-medium hover:bg-bg">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-navy hover:bg-navy-dark'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
