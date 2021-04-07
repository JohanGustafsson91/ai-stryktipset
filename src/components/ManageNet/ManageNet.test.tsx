import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManageNet } from ".";

import { setupServer } from "msw/node";
import { handlers } from "mocks/handlers";
import { rest } from "msw";
import { GET_STRYKTIPS_ENDPOINT, POST_NET_ENDPOINT } from "shared/endpoints";

export const server = setupServer(...handlers);

const serverCall = jest.fn();

server.on("request:end", (req) => serverCall(req.url.toString()));
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
beforeEach(() => serverCall.mockReset());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("successfully fetches stryktipset data", async () => {
  render(<ManageNet />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();
  expect(await screen.findAllByText(/Stryktipset v/)).toHaveLength(3);
  expect(serverCall.mock.calls.flat()).toEqual([GET_STRYKTIPS_ENDPOINT]);
});

test("shows error message when fetching stryktipset error", async () => {
  server.use(
    rest.get(GET_STRYKTIPS_ENDPOINT, (req, res, ctx) =>
      res(ctx.status(400), ctx.json({}))
    )
  );
  render(<ManageNet />);

  expect(
    await screen.findByText("Could not fetch stryktips data")
  ).toBeInTheDocument();
  expect(serverCall.mock.calls.flat()).toEqual([
    GET_STRYKTIPS_ENDPOINT,
    GET_STRYKTIPS_ENDPOINT,
    GET_STRYKTIPS_ENDPOINT,
  ]);
});

test("trains net", async () => {
  render(<ManageNet />);
  const selectGames = await screen.findByRole("button", { name: "Select all" });
  const formButton = screen.getByRole("button", { name: "Train" });

  userEvent.click(selectGames);
  userEvent.click(formButton);

  expect(
    await screen.findByText("Connect to socket", { exact: false })
  ).toBeInTheDocument();

  expect(serverCall.mock.calls.flat()).toEqual([
    GET_STRYKTIPS_ENDPOINT,
    POST_NET_ENDPOINT,
  ]);
});
