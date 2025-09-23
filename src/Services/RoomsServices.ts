import apiAxios from "../ApiConfig/ApiConfig";
import type { PartialRoom, Room } from "../models/Room";

const BASE = '/api/Rooms'

export async function createRoom (room : PartialRoom) : Promise<Room>{
    try{
        const {data} = await apiAxios.post<Room>(`${BASE}`, room)
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function joinRoom (room : PartialRoom) : Promise<Room>{
    try{
        const {data} = await apiAxios.post<Room>(`${BASE}`, room)
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function joinRooms(payload: { code: number }): Promise<Room> {
  const { data } = await apiAxios.post<Room>(`${BASE}/join`, payload);
  console.log(data);
  return data;
}

export async function getRoomByCode (code : number) : Promise<Room>{
    try{
        const {data} = await apiAxios.get<Room>(`${BASE}/code/${code}`);
        return data;
    }catch(err){
        return Promise.reject(err);
    }
}

export async function deletePlayer (code : number, id : number): Promise<void>{
  await apiAxios.delete(`${code}/players/${id}`)
}