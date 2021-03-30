import { Odds, Result, Stryktips } from "models/Stryktips";
import { rest } from "msw";
import rawData from "./mock.db";

export const getPlayedGames = rest.get(
  `${process.env.REACT_APP_BACKEND_URL}/stryktipset`,
  (req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200), ctx.json(formatStryktipsData(rawData)))
);

const formatStryktipsData = (data: typeof rawData): { items: Stryktips[] } => ({
  items: data.map((item) => ({
    id: item._id,
    name: item.description,
    games: item.games.map((game) => ({
      id: game._id,
      homeTeam: game.homeTeam.name,
      awayTeam: game.awayTeam.name,
      result: formatResults(game.results),
      odds: formatOdds(game.odds.find((o) => o.source === "oddsportal")),
    })),
  })),
});

const formatResults = (result: ResultMongo): Result =>
  Object.keys(result).reduce((acc, curr) => {
    const resultKey = curr as keyof ResultMongo;
    const isGameResult = result[resultKey] === true;
    return isGameResult ? MAP_RESULT[resultKey] : acc;
  }, "") as Result;

const formatOdds = (odds: any): Odds => ({
  1: odds.one,
  X: odds.x,
  2: odds.two,
});

const MAP_RESULT = {
  one: "1",
  x: "X",
  two: "2",
};

interface ResultMongo {
  one: boolean;
  x: boolean;
  two: boolean;
}
