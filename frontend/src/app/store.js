import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import usersReducer from "./userSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});
