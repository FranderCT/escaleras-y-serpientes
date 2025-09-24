import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createRoom, deletePlayer, getRoomByCode, joinRooms } from "../Services/RoomsServices";
import type { Room } from "../models/Room";

export const useCraeteRoom = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey : ['room'],
        mutationFn : createRoom,
        onSuccess: (res) =>{
            console.log('Room creada', res);
            qc.invalidateQueries({queryKey: ['room']});
            sessionStorage.setItem('rol', "HOST");
        },
        onError : (err) =>{
            console.error(err)
        }
    })

    return mutation;
}

export const useJoinRoom = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey : ['room', 'join'],
        mutationFn : joinRooms,
        onSuccess: (res) =>{
            console.log('Entraste al room', res);
            qc.invalidateQueries({queryKey: ['room', 'current']});
        },
        onError : (err) =>{
            console.error(err)
        }
    })

    return mutation;
}

export function useJoinRooms() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["room", "join"],
    mutationFn: async (payload: { code: number }) => {
      const room: Room = await joinRooms(payload);
      // await ensureStarted();
      // await joinSignalRGroup(String(room.code));
      return room;
    },
    onSuccess: (res) => {
      console.log("Entraste al room", res);
      qc.invalidateQueries({ queryKey: ["room", "current"] });
    },
    onError: (err) => console.error(err),
  });
}

export const useGetRoomByCode = (code?: number) => {
  const { data: Room, isLoading, error } = useQuery<Room>({
    queryKey: ["room", code],
    queryFn: () => getRoomByCode(code!),
    enabled: typeof code === "number" && Number.isFinite(code),
  });

  return { Room, isLoading, error };
};

export const useDeletePlayer = (code: number, id: number) => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["room", code, "delete-player", id],
    mutationFn: () => deletePlayer(code, id),
    onSuccess: () => {
      console.log(`Jugador ${id} eliminado de la sala ${code}`);
      // invalidas el cache de los jugadores de la sala
      qc.invalidateQueries({ queryKey: ["players", code] });
    },
    onError: (err) => {
      console.error("Error eliminando jugador:", err);
    },
  });

  return mutation;
};

