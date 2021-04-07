import { rest } from "msw";
import { POST_NET_ENDPOINT } from "shared/endpoints";
import shortid from "shortid";

export const postNet = rest.post(POST_NET_ENDPOINT, (req, res, ctx) =>
  res(ctx.delay(200), ctx.status(200), ctx.json({ id: shortid() }))
);
