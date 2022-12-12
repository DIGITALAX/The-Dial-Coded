import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignInState {
  value?: boolean;
}

const initialSignInState: SignInState = {
  value: false,
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState: initialSignInState,
  reducers: {
    setSignIn: (
      state: SignInState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSignIn } = signInSlice.actions;

export default signInSlice.reducer;
