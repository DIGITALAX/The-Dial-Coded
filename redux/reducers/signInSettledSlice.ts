import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignInSettledState {
  value: boolean;
}

const initialSignInSettledState: SignInSettledState = {
  value: false,
};

export const signInSettledSlice = createSlice({
  name: "signInSettled",
  initialState: initialSignInSettledState,
  reducers: {
    setSignInSettled: (
      state: SignInSettledState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSignInSettled } = signInSettledSlice.actions;

export default signInSettledSlice.reducer;
