// src/components/Rooms/RoomJoinModal.tsx
import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import Modal from "./Modal";
import ButtonOptions from "../StartGame/ButtonOptions";
import { useJoinRoom } from "../../Hooks/RoomHooks";

type Props = {
  open: boolean;
  onClose: () => void;
  onJoined?: (room: any) => void; // opcional: navegar o mostrar toast
};

export default function RoomJoinModal({ open, onClose, onJoined }: Props) {
  const joinMutation = useJoinRoom();

  
  const form = useForm({
    defaultValues: { code: "" },
    onSubmit: async ({ value }) => {
      const raw = (value.code ?? "").trim();
      const codeNum = Number(raw); 
      const res = await joinMutation.mutateAsync({ code: codeNum });
      console.log(value.code)
      onJoined?.(res);
      onClose();
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!joinMutation.isPending) onClose();
      }}
      title="Unirse a una sala"
      footer={
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex items-center gap-3">
              <ButtonOptions
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </ButtonOptions>
              <ButtonOptions
                onClick={() => form.handleSubmit()}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Uniendo…" : "Unirme"}
              </ButtonOptions>
            </div>
          )}
        </form.Subscribe>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <form.Field
          name="code"
          validators={{
            onChange: ({ value }) => {
              const v = (value ?? "").trim();
              if (v.length !== 4) return "Debe tener 4 dígitos.";
              const n = Number(v);
              if (!Number.isInteger(n) || n < 1000 || n > 9999) {
                return "Código válido: 1000–9999.";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1">
              <label className="block text-sm text-white/80" htmlFor="join-code">
                Código de la sala
              </label>
              <input
                id="join-code"
                autoFocus
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ej: 1234"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)} // ← sin only4Digits
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby="code-help"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-400">{field.state.meta.errors[0]}</p>
              )}
              <p id="code-help" className="text-xs text-white/50">
                {(field.state.value?.length ?? 0)}/4
              </p>
            </div>
          )}
        </form.Field>
      </form>
    </Modal>
  );
}
