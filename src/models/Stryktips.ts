export interface Stryktips {
  id: string;
  name: string;
  games: Game[];
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  result: "1" | "X" | "2";
  odds: Odds;
}

export type Odds = {
  1: string;
  X: string;
  2: string;
};
