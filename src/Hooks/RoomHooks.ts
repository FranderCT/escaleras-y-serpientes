import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoom, joinRoom, joinRooms } from "../Services/RoomsServices";
import { ensureStarted, joinSignalRGroup } from "../signalRConnection";
import type { Room } from "../models/Room";

export const useCraeteRoom = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey : ['room'],
        mutationFn : createRoom,
        onSuccess: (res) =>{
            console.log('Room creada', res);
            qc.invalidateQueries({queryKey: ['room']});
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
        mutationFn : joinRoom,
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
      await ensureStarted();
      await joinSignalRGroup(String(room.code));
      return room;
    },
    onSuccess: (res) => {
      console.log("Entraste al room", res);
      qc.invalidateQueries({ queryKey: ["room", "current"] });
    },
    onError: (err) => console.error(err),
  });
}