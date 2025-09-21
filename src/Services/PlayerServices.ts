import apiAxios from "../ApiConfig/ApiConfig";
import type { PartialPlayer, Player } from "../models/Player";

const BASE = '/api/Players'

export async function createPlayer(player: PartialPlayer): Promise<Player> {
  try {
    const { data } = await apiAxios.post<Player>(`${BASE}`, player);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}
