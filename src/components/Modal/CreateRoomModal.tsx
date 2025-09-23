// src/components/Rooms/RoomCreateModal.tsx
import { useForm } from "@tanstack/react-form";

import ButtonOptions from "../StartGame/ButtonOptions";

import { useEffect } from "react";
import Modal from "./Modal";
import { useCraeteRoom } from "../../Hooks/RoomHooks";
import { RoomInitialState } from "../../models/Room";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (room: any) => void; // opcional, por si quieres navegar al crear
};

export default function RoomCreateModal({ open, onClose, onCreated}: Props) {
  const createRoom = useCraeteRoom();


  const form = useForm({
    defaultValues: RoomInitialState,
    onSubmit: async ({ value }) => {
      const res = await createRoom.mutateAsync(value);
      onCreated?.(res);
      onClose();
      toast.success(`Sala creada, su código es: ${res.code}`, {
        position: "top-center",
        className: "text-xl font-bold text-center", 
        autoClose: 9000,
      });
      
    },
  });



  
  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!createRoom.isPending) onClose();
      }}
      title="Crear nueva sala"
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
                {isSubmitting ? "Creando…" : "Confirmar"}
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
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value || !value.trim()) return "El nombre es requerido.";
              if (value.trim().length < 3) return "Mínimo 3 caracteres.";
              if (value.trim().length > 50) return "Máximo 50 caracteres.";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1">
              <label className="block text-sm text-white/80">Nombre de la sala</label>
              <input
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ej: Sala Binarios"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-400">{field.state.meta.errors[0]}</p>
              )}
              <p className="text-xs text-white/50">
                {(field.state.value?.length ?? 0)}/50
              </p>
            </div>
          )}
        </form.Field>
      </form> 
    </Modal>
  );
}
