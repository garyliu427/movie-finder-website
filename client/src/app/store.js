import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";

const saveUserState = (user) => {
  try {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem("user", serializedUser);
  } catch (err) {
    console.error(err);
  }
};

const loadUserState = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) {
      return undefined;
    }
    return JSON.parse(serializedUser);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const userMiddleware = (store) => (next) => (action) => {
  next(action);
  const userState = store.getState().user;
  saveUserState(userState);
};

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: loadUserState(),
  },
  middleware: [userMiddleware],
});
