import axios from "axios";
import store from "./store/store";

const BASE_URL = "https://classroom-backend-obd0.onrender.com";

const publicRequest = axios.create({
  baseURL: BASE_URL,
});

const privateRequest = axios.create({
  baseURL: BASE_URL,
});

privateRequest.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { publicRequest, privateRequest };
