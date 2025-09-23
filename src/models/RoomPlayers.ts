import type { Player } from "./Player";
import type { Room } from "./Room";

export interface RoomPlayers{
    id : number;
    playerId: number;
    player: Player;
    roomId: number;
    room : Room;
    turnOrder: number;
    position: number;
}