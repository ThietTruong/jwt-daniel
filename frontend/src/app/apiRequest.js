import axios from "axios";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  registerStart,
} from "./authSlice";

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

export const registerUser = async (user, dispatch, navigator) => {
  dispatch(registerStart());
  try {
    await axios.post("http://localhost:4000/api-v1/auth/register", user);
    dispatch(registerSuccess());
    navigator("/login");
  } catch (error) {
    console.error(error);
    dispatch(registerFailure());
  }
};
