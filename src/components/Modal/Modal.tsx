import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import ButtonOptions from "../StartGame/ButtonOptions";


type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    // Foco inicial
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onEsc);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-[92%] sm:w-[520px] max-w-[90vw] rounded-2xl border border-white/10 bg-[#121318] text-white shadow-2xl outline-none
                   animate-[fadeIn_.15s_ease-out]"
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h3 id="modal-title" className="text-lg font-semibold">
              {title ?? "Modal"}
            </h3>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          {footer ?? (
            <>
              <ButtonOptions variant="ghost" onClick={onClose}>
                Cancelar
              </ButtonOptions>
              <ButtonOptions>Confirmar</ButtonOptions>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
