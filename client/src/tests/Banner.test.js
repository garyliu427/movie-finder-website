import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Banner from "../components/Banner";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../app/store";

describe("Banner", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Banner />
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText("Read more")).toBeInTheDocument();
  });

  it("renders correctly with logged-in user", () => {
    const mockStore = configureStore([]);
    const store = mockStore({
      user: {
        username: {
          name: "test",
          email: "test@gmail.com",
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Banner />
        </MemoryRouter>
      </Provider>,
    );

    const sentence = getByText("Welcome test@gmail.com!");

    expect(sentence).toBeInTheDocument();
  });
});
