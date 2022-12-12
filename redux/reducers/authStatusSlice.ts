import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthStatusState {
  value: string;
}

const initialAuthStatusState: AuthStatusState = {
  value: "unknown",
};

export const authStatusSlice = createSlice({
  name: "auth status",
  initialState: initialAuthStatusState,
  reducers: {
    setAuthStatus: (state: AuthStatusState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setAuthStatus } = authStatusSlice.actions;

export default authStatusSlice.reducer;
