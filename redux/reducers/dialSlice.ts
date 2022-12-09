import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DialState {
  value?: string;
}

const initialDialtState: DialState = {
  value: "Scanner",
};

export const dialSlice = createSlice({
  name: "dial",
  initialState: initialDialtState,
  reducers: {
    setDial: (state: DialState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setDial } = dialSlice.actions;

export default dialSlice.reducer;
