import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// test("renders learn react link", () => {
//   render(<App />);
//   const cont = screen.getByTestId("app");
//   expect(cont).toBeInTheDocument();
//   //expect(linkElement).toBeInTheDocument();
// });

describe("<App />", () => {
  it("makes the api call", () => {
    jest.mock("../data/products");
    render(<App />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders testing text", () => {
    render(<App />);
    const testText = screen.getByText(/Learning React, SIRI/i);
    expect(testText).toBeInTheDocument();
  });

  it("renders as expected", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  test("clicking the button toggles button messages", () => {
    render(<App />);
    let buttonText;

    setTimeout(() => {
      const buttons = screen.getAllByText(/Add to Cart/i);
      fireEvent.click(buttons[0]);
      buttonText = buttons[0].getByText(/In Cart/i);
      expect(buttonText).toBeInDocument();

      fireEvent.click(buttons[0]);
      buttonText = buttons[0].getByText(/Add to Cart/i);
      expect(buttonText).toBeInDocument();
    }, 2000);
  });
});
