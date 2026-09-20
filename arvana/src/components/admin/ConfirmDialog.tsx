import { AlertTriangle } from "lucide-react";
import { Button } from "../common/Button";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-charcoal/60" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wood/10 text-wood">
          <AlertTriangle size={20} />
        </div>
        <h3 className="mt-4 font-display text-lg text-charcoal">{title}</h3>
        <p className="mt-1.5 text-sm text-charcoal-light">{message}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 !bg-wood !border-wood hover:!bg-wood-dark"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
