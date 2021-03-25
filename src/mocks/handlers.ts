import { Game, Stryktips } from "models/Stryktips";
import { rest } from "msw";
import shortid from "shortid";

export const handlers = [
  rest.get("/played-games", (req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(400), ctx.json(createStryktips()));
  }),
];

const createStryktips = (): { items: Stryktips[] } => ({
  items: [
    {
      id: shortid(),
      name: "Stryktipset v 34",
      games: createGames(),
    },
    {
      id: shortid(),
      name: "Stryktipset v 35",
      games: createGames(),
    },
    {
      id: shortid(),
      name: "Stryktipset v 36",
      games: createGames(),
    },
  ],
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
