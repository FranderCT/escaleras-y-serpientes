import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPlayer, getPlayer } from "../Services/PlayerServices";

export const useCreatePlayer = () =>{
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey : ['player'],
        mutationFn : createPlayer,
        onSuccess: (res) =>{
            console.log('Player Registrado', res);
            qc.invalidateQueries({queryKey: ['player']});
            localStorage.setItem('token', res.token);
        },
        onError : (err) =>{
            console.error(err)
        }
    })

    return mutation;
}

export const useGetPlayer = () => {
    const {data: UserPlayer, isLoading, error} = useQuery({
        queryKey: ['player'],
        queryFn: () => getPlayer()
    });
    return { UserPlayer, isLoading, error };
}