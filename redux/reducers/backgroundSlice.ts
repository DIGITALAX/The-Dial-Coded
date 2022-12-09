import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BackgroundState {
  value: number;
}

const initialBackgroundState: BackgroundState = {
  value: 0,
};

export const backgroundSlice = createSlice({
  name: "background",
  initialState: initialBackgroundState,
  reducers: {
    setBackground: (state: BackgroundState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setBackground } = backgroundSlice.actions;

export default backgroundSlice.reducer;
