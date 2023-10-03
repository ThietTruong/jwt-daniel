import axios from "axios";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  registerStart,
} from "./authSlice";

import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "./userSlice";

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

export const getAllUsers = async (accessToken, dispatch) => {
  dispatch(getUsersStart());
  const res = await axios.get("http://localhost:4000/api-v1/user", {
    headers: {
      token: "Bearer " + accessToken,
    },
  });
  try {
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    dispatch(getUsersFailure());
  }
};

export const deleteUser = async (id, accessToken, dispatch) => {
  dispatch(deleteUserStart());
  try {
    const res = await axios.delete(`http://localhost:4000/api-v1/user/${id}`, {
      headers: {
        token: "Bearer " + accessToken,
      },
    });
    dispatch(
      deleteUserSuccess({
        id: res.data.user._id,
        msg: "User deleted successfully",
      })
    );
  } catch (error) {
    dispatch(deleteUserFailure("Delete user failed"));
  }
};
