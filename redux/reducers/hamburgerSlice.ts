import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HamburgerState {
  value?: boolean;
}

const initialHamburgerState: HamburgerState = {
  value: false,
};

export const hamburgerSlice = createSlice({
  name: "more feed",
  initialState: initialHamburgerState,
  reducers: {
    setHamburger: (
      state: HamburgerState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHamburger } = hamburgerSlice.actions;

export default hamburgerSlice.reducer;
