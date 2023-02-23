import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SvgPatternType } from "../../components/Home/Layout/Canvas/types/canvas.types";

export interface SelectSynthElementState {
  value?: SvgPatternType;
}

const initialSelectSynthElementState: SelectSynthElementState = {
  value: undefined,
};

export const selectSynthElementSlice = createSlice({
  name: "selectSynthElement",
  initialState: initialSelectSynthElementState,
  reducers: {
    setSelectSynthElement: (
      state: SelectSynthElementState,
      action: PayloadAction<SvgPatternType>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSelectSynthElement } = selectSynthElementSlice.actions;

export default selectSynthElementSlice.reducer;
