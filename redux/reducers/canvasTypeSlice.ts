import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CanvasTypeState {
  value: boolean;
}

const initialCanvasTypeState: CanvasTypeState = {
  value: false,
};

export const canvasTypeSlice = createSlice({
  name: "canvasType",
  initialState: initialCanvasTypeState,
  reducers: {
    setCanvasType: (state: CanvasTypeState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCanvasType } = canvasTypeSlice.actions;

export default canvasTypeSlice.reducer;
