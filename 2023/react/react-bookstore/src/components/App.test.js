import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const cont = screen.getByTestId("app");
  expect(cont).toBeInTheDocument();
  //expect(linkElement).toBeInTheDocument();
});
