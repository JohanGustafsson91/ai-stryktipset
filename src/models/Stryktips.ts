export interface Stryktips {
  id: string;
  name: string;
  games: PlayedGame[];
}

export interface PlayedGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  result: Result | null;
  odds: Odds;
}

export type Odds = {
  1: string;
  X: string;
  2: string;
};

export type Result = "1" | "X" | "2";
