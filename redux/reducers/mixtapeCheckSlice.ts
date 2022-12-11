import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapeCheckState {
  value?: string;
}

const initialMixtapeCheckState: MixtapeCheckState = {
  value: undefined,
};

export const mixtapeCheckSlice = createSlice({
  name: "mixtape check",
  initialState: initialMixtapeCheckState,
  reducers: {
    setMixtapeCheck: (
      state: MixtapeCheckState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtapeCheck } = mixtapeCheckSlice.actions;

export default mixtapeCheckSlice.reducer;
