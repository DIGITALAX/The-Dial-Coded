import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SvgPatternType } from "../../components/Home/Layout/Canvas/types/canvas.types";

export interface SelectSynthElementState {
  value: any[];
}

const initialSelectSynthElementState: SelectSynthElementState = {
  value: [],
};

export const selectSynthElementSlice = createSlice({
  name: "selectSynthElement",
  initialState: initialSelectSynthElementState,
  reducers: {
    setSelectSynthElement: (
      state: SelectSynthElementState,
      action: PayloadAction<any[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSelectSynthElement } = selectSynthElementSlice.actions;

export default selectSynthElementSlice.reducer;
