import { rest } from "msw";
import shortid from "shortid";

export const postNet = rest.post("/net", (req, res, ctx) =>
  res(ctx.delay(200), ctx.status(200), ctx.json({ id: shortid() }))
);
