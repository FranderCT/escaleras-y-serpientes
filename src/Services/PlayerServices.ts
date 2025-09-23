import apiAxios from "../ApiConfig/ApiConfig";
import type { PartialPlayer, Player} from "../models/Player";
import type { PlayerResponse } from "../models/PlayerResponse";

const BASE = '/api/Players'

export async function createPlayer(player: PartialPlayer): Promise<PlayerResponse> {
  try {
    const { data } = await apiAxios.post<PlayerResponse>(`${BASE}`, player);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getPlayer(): Promise<Player> {
  try{
  const response = await apiAxios.get<Player>(`${BASE}/me`);
  return response.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
}

