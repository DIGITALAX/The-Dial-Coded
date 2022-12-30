import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapeTitleState {
  value: string;
}

const initialMixtapeTitleState: MixtapeTitleState = {
  value: "",
};

export const mixtapeTitleSlice = createSlice({
  name: "mixtapeTitle",
  initialState: initialMixtapeTitleState,
  reducers: {
    setMixtapeTitle: (
      state: MixtapeTitleState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtapeTitle } = mixtapeTitleSlice.actions;

export default mixtapeTitleSlice.reducer;
