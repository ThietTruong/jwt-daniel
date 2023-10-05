import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  registerStart,
  logoutStart,
  logoutSuccess,
  logoutFailure,
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
      "http://localhost:8000/api-v1/auth/login",
      user,
      { withCredentials: true }
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
    await axios.post("http://localhost:8000/api-v1/auth/register", user);
    dispatch(registerSuccess());
    navigator("/login");
  } catch (error) {
    console.error(error);
    dispatch(registerFailure());
  }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());

  try {
    const res = await axios.get("http://localhost:8000/api-v1/user", {
      headers: {
        token: "Bearer " + accessToken,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    dispatch(getUsersFailure());
  }
};

export const deleteUser = async (id, accessToken, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`/api-v1/user/${id}`, {
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

export const logout = async (
  id,
  accessToken,
  dispatch,
  navigator,
  axiosJWT
) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.pos t(
      "/api-v1/auth/logout",
      {},
      {
        headers: {
          token: "Bearer " + accessToken,
        },
      }
    );
    dispatch(logoutSuccess());
    navigator("/login");
  } catch (error) {
    dispatch(logoutFailure());
  }
};
