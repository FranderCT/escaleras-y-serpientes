
export interface Player1{
    Id : number;
    NamePlayer : string;
    TurnOrder?: number;
    Position?: number;
    Wins : number;
}

export interface Player{
    id : number;
    name : string;
    turnOrder: number;
    position: number;
    wins : number;
}

export type PartialPlayer = Partial<Player>;

export const newPlayerInitialState: PartialPlayer = {
  id: 0,
  name: "",
  turnOrder: 1,
  position: 0,
  wins: 0,
};

