import axios from "axios";
import { apiEndpoints } from "../constants/apiEndpoints";

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(apiEndpoints.LOGIN, credentials);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
