
export interface Player1{
    Id : number;
    NamePlayer : string;
    TurnOrder?: number;
    Position?: number;
    Wins : number;
}

export interface Player{
    Id : number;
    Name : string;
    TurnOrder: number;
    Position: number;
    Wins : number;
}

export type PartialPlayer = Partial<Player>;

export const newPlayerInitialState: PartialPlayer = {
  Id: 0,
  Name: "",
  TurnOrder: 1,
  Position: 0,
  Wins: 0,
};

