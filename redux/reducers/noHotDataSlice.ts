import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NoHotDataState {
  value: boolean;
}

const initialNoHotDataState: NoHotDataState = {
  value: false,
};

export const noHotDataSlice = createSlice({
  name: "noHotData",
  initialState: initialNoHotDataState,
  reducers: {
    setNoHotData: (
      state: NoHotDataState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setNoHotData } = noHotDataSlice.actions;

export default noHotDataSlice.reducer;
