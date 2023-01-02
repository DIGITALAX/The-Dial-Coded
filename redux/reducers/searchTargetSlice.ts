import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchTargetState {
  value: string;
}

const initialSearchTargetState: SearchTargetState = {
  value: "",
};

export const searchTargetSlice = createSlice({
  name: "searchTarget",
  initialState: initialSearchTargetState,
  reducers: {
    setSearchTarget: (state: SearchTargetState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchTarget } = searchTargetSlice.actions;

export default searchTargetSlice.reducer;
