import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapePageState {
  value?: string;
}

const initialMixtapePageState: MixtapePageState = {
  value: "Add New Mixtape",
};

export const mixtapePageSlice = createSlice({
  name: "mixtapePage",
  initialState: initialMixtapePageState,
  reducers: {
    setMixtapePage: (
      state: MixtapePageState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtapePage } = mixtapePageSlice.actions;

export default mixtapePageSlice.reducer;
