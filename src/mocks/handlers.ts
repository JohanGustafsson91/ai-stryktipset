import { Game, Stryktips } from "models/Stryktips";
import { rest } from "msw";
import shortid from "shortid";

export const handlers = [
  rest.get("/played-games", (req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200), ctx.json(createStryktips()))
  ),
];

const createStryktips = (): { items: Stryktips[] } => ({
  items: Array(3)
    .fill(null)
    .map((_, i) => ({
      id: shortid(),
      name: `Stryktipset v3${i + 1}`,
      games: createGames(),
    })),
});

const createGames = (numOfItems = 13): Game[] =>
  Array(numOfItems)
    .fill(null)
    .map((u, i) => ({
      id: shortid(),
      homeTeam: `homeTeam-${i}`,
      awayTeam: `awayTeam-${i}`,
      result: "1",
      odds: {
        1: "2.1",
        X: "2.1",
        2: "2.1",
      },
    }));
