import { render, screen } from "@testing-library/react";
import Header from "./Header";

// test("renders learn react link", () => {
//   render(<Header />);
//   const linkElement = screen.getByText(/Learning React/i);
//   expect(linkElement).toBeInTheDocument();
// });

test("Personalizes welcome message with first name", () => {
  render(<Header firstName="Siri" />);
  const welcomeMessage = screen.getByText(/Siri/i);
  expect(welcomeMessage).toBeInTheDocument();
});
