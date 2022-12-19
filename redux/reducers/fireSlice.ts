import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FireState {
  value?: number;
}

const initialFireState: FireState = {
  value: 0,
};

export const fireSlice = createSlice({
  name: "fire",
  initialState: initialFireState,
  reducers: {
    setFire: (
      state: FireState,
      action: PayloadAction<number>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFire } = fireSlice.actions;

export default fireSlice.reducer;
