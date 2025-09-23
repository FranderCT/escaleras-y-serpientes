import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InitGame, palyTurn } from "../Services/ResumeService";

export const useInitGame = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["resume", "init"],
    mutationFn: (roomcode: number) => InitGame(roomcode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["room", "current"] });
    },
  });
};

export const usePlayTurn = () =>
  useMutation({
    mutationKey: ["resume", "turn"],
    mutationFn: (roomcode: number) => palyTurn(roomcode),
});

export const useResumeActions = () => {
  const initGame = useInitGame();
  const playTurn = usePlayTurn();
  return { initGame, playTurn };
};
