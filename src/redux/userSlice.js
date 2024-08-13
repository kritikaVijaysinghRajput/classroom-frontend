import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isFetching = false;
    },
    setFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { setUser, setFetching, setError, resetUser } = userSlice.actions;

export default userSlice.reducer;
