// src/components/Rooms/RoomJoinModal.tsx
import { useForm } from "@tanstack/react-form";
import Modal from "./Modal";
import ButtonOptions from "../StartGame/ButtonOptions";
import { useJoinRooms } from "../../Hooks/RoomHooks";
import { joinSignalRRoom } from "../../signalRConnection";
import { useGetPlayer } from "../../Hooks/PlayerHooks";
import { useNavigate } from "@tanstack/react-router";
import { roomByCodeRoute } from "../../Routes";
import { useSessionStore } from "../../stores/sessionStore";


type Props = {
  open: boolean;
  onClose: () => void;
  onJoined?: (room: any) => void;
};

export default function RoomJoinModal({ open, onClose, onJoined }: Props) {
  const joinMutation = useJoinRooms();
  const player = useGetPlayer();
  const userName = player.UserPlayer?.name ?? "Player";
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { code: "" },
    onSubmit: async ({ value }) => {
      const raw = (value.code ?? "").trim();
      const digits = raw.replace(/\D/g, "").slice(0, 4);
      if (digits.length !== 4) {
        // feedback rápido
        form.setFieldMeta("code", (m) => ({
          ...m,
          errors: ["Debe ser un código de 4 dígitos"],
        }));
        return;
      }
      const codeNum = Number(digits);

      const res = await joinMutation.mutateAsync({ code: codeNum });

      const groupToJoin = String(res.name ?? res?.code ?? codeNum);
      await joinSignalRRoom(groupToJoin, userName);
      useSessionStore.getState().setCurrentRoom(groupToJoin);
      
      onJoined?.(res);
      onClose();

      navigate({
        to: roomByCodeRoute.to,
        params: { code: String(codeNum) },
      });
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Unirse a sala"
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
                {isSubmitting ? "Creando…" : "Buscar"}
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
        className="space-y-4"

      >
        {form.Field({
          name: "code",
          children: (field) => (
            <div className="space-y-1">
              <input
                inputMode="numeric"
                type="text"
                pattern="\d{4}"
                maxLength={4}
                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ej: 1234"
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.handleChange(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-400">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          ),
        })}

        
      </form>
    </Modal>
  );
}
