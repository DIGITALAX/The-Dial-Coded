import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayoutState {
  value?: string;
}

const initialLayoutState: LayoutState = {
  value: "post",
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState: initialLayoutState,
  reducers: {
    setLayout: (state: LayoutState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setLayout } = layoutSlice.actions;

export default layoutSlice.reducer;
