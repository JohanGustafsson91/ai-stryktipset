import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManageNet } from ".";

import { setupServer } from "msw/node";
import { handlers } from "mocks/handlers";
import { rest } from "msw";

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
  expect(
    await screen.findByText("Stryktipset v 4, stänger 2021-01-30 15:59 brain")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Stryktipset v 7, stänger 2021-02-20 15:59 brainjs")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Stryktipset v 9, stänger 2021-03-06 15:59 brainjs")
  ).toBeInTheDocument();
  expect(serverCall.mock.calls.flat()).toEqual([
    "http://localhost:8080/stryktipset",
  ]);
});

test("shows error message when fetching stryktipset error", async () => {
  server.use(
    rest.get(
      `${process.env.REACT_APP_BACKEND_URL}/stryktipset`,
      (req, res, ctx) => res(ctx.status(400), ctx.json({}))
    )
  );
  render(<ManageNet />);

  expect(
    await screen.findByText("Could not fetch stryktips data")
  ).toBeInTheDocument();
  expect(serverCall.mock.calls.flat()).toEqual([
    "http://localhost:8080/stryktipset",
    "http://localhost:8080/stryktipset",
    "http://localhost:8080/stryktipset",
  ]);
});

test("trains net", async () => {
  render(<ManageNet />);
  const formButton = await screen.findByRole("button", { name: "Train" });

  userEvent.click(formButton);

  expect(
    await screen.findByText("Connect to socket", { exact: false })
  ).toBeInTheDocument();

  expect(serverCall.mock.calls.flat()).toEqual([
    "http://localhost:8080/stryktipset",
    "http://localhost:8080/net/train",
  ]);
});
