import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "../components/NavBar";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../app/store";

describe("Navbar", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>,
    );

    // Assert that the logo is present in the NavBar
    expect(getByText("Movies")).toBeInTheDocument();

    expect(getByText("Search")).toBeInTheDocument();
  });

  it("renders correctly with logged-in user", async () => {
    const mockStore = configureStore([]);
    const store = mockStore({
      user: {
        username: {
          name: "test",
          email: "test@gmail.com",
        },
      },
    });

    const { findByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>,
    );

    const logoutButton = await findByTestId("logout");

    expect(logoutButton).toBeInTheDocument();
  });
});
