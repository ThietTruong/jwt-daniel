import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {
    allUser: null,
    isFetching: false,
    error: false,
  },
  msg: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsersStart: (state) => {
      state.isFetching = true;
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.allUser = action.payload;
      state.error = false;
    },
    getUsersFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    deleteUserStart: (state, action) => {
      state.isFetching = true;
    },
    deleteUserSuccess: (state, action) => {
      state.allUser = state.allUser.filter(
        (user) => user._id !== action.payload.id
      );
      state.msg = action.payload.msg;
      state.isFetching = false;
      state.error = false;
    },
    deleteUserFailure: (state) => {
      state.isFetching = false;
      state.error = false;
      state.msg = "Delete user failed";
    },
  },
});
export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
