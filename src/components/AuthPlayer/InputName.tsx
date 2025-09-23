import { useForm } from "@tanstack/react-form";
import { useCreatePlayer } from "../../Hooks/PlayerHooks";
import { newPlayerInitialState } from "../../models/Player";
import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";

const InputName = () => {
  const createPlayerMutation = useCreatePlayer();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: newPlayerInitialState,
    onSubmit: async ({ value }) => {
      try {
        await createPlayerMutation.mutateAsync(value);
        navigate({ to: "/startgame" });
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <div className="w-full rounded-lg p-4 text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {/* Card de input al estilo ListPlayers */}
        <form.Field name="name">
          {(field) => (
            <label className="flex items-center gap-3 rounded-lg bg-[#22232b] px-4 py-3 shadow-md ring-1 ring-white/10">
              <User className="h-5 w-5 text-indigo-400" />
              <input
                autoFocus
                className="w-full bg-transparent text-white placeholder-white/50 outline-none"
                placeholder="Ingrese su nickname"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 w-full rounded-lg bg-indigo-500 font-medium text-white shadow-md ring-1 ring-white/10 transition hover:bg-indigo-400 disabled:opacity-60"
            >
              {isSubmitting ? "Registrando…" : "Registrar"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default InputName;
