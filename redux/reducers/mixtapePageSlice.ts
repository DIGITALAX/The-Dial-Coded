import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapePageState {
  value?: string;
}

const initialMixtapePageState: MixtapePageState = {
  value: "Create",
};

export const mixtapePageSlice = createSlice({
  name: "Mixtape page",
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
