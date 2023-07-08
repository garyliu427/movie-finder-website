import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: { username: localStorage.getItem("authToken") },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    resetUsername: (state) => {
      state.username = "";
    },
  },
});

export const { setUsername, resetUsername } = userSlice.actions;

export const selectUser = (state) => state.user.username;
export const selectHasUser = (state) => state.user.username?.email?.length > 0;

export default userSlice.reducer;
