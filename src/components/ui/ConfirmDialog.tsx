import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Hapus',
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel} title={title} maxWidthClass="max-w-sm">
    <div className="text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-3">
        <AlertTriangle size={22} />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
    </div>
    <div className="flex justify-end gap-2 pt-5 mt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
      >
        Batal
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-sm transition"
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);
