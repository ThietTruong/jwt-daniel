import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logout: (state) => {
      state.login.currentUser = null;
    },
  },
});

export default authSlice.reducer;
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
