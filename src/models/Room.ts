import type { Resume } from "./Resume";
import type { RoomPlayers } from "./RoomPlayers";

export interface Room {
    name : string;
    code : number;
    minPlayers: number;
    maxPlayers: number;
    isStarted : boolean;
    currentTurnOrder : number;
    roomPlayers : RoomPlayers[];
    resume:Resume[];
}
export type PartialRoom = Partial<Room>;

export const RoomInitialState: PartialRoom = {
    name : '',
    code : 0,
}