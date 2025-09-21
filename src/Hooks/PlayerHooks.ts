import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPlayer } from "../Services/PlayerServices";

export const useCreatePlayer = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey : ['player'],
        mutationFn : createPlayer,
        onSuccess: (res) =>{
            console.log('Player Registrado', res);
            qc.invalidateQueries({queryKey: ['player']})
        },
        onError : (err) =>{
            console.error(err)
        }
    })

    return mutation;
}