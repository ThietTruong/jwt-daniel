import axios from "axios";
import jwt_decode from "jwt-decode";

export const refreshToken = async () => {
  const http = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });
  try {
    const res = await http.post("/api-v1/auth/refresh-token");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const http = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });
  http.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(stateSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return http;
};
