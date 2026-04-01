import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import App from "./App";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

test("renders login screen when unauthenticated", () => {
  localStorage.clear();

  render(
    <HashRouter>
      <App />
    </HashRouter>
  );

  expect(
    screen.getByText(/sign in to schedule messages/i)
  ).toBeInTheDocument();
});
