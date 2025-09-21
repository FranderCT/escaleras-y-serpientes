export interface Room {
    name : string;
    code : number;
    minPlayers: number;
    maxPlayers: number;
    isStarted : boolean;
    currentTurnOrder : number;
    resume : boolean;
    roomPlayers : boolean;
}
export type PartialRoom = Partial<Room>;

export const RoomInitialState: PartialRoom = {
    name : '',
    code : 0,
}