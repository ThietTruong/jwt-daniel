import axios from "axios";

import { loginStart, loginSuccess, loginFailure } from "./authSlice";

export const loginUser = async (user, dispatch, navigator) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "http://localhost:4000/api-v1/auth/login",
      user
    );
    dispatch(loginSuccess(res.data));
    navigator("/");
  } catch (error) {
    dispatch(loginFailure());
  }
};
