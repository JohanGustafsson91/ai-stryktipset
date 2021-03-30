import { rest } from "msw";
import shortid from "shortid";

export const postNet = rest.post(
  `${process.env.REACT_APP_BACKEND_URL}/net/train`,
  (req, res, ctx) =>
    res(ctx.delay(200), ctx.status(200), ctx.json({ id: shortid() }))
);
