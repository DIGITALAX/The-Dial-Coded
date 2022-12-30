import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapeSourceState {
  value: string;
}

const initialMixtapeSourceState: MixtapeSourceState = {
  value: "",
};

export const mixtapeSourceSlice = createSlice({
  name: "mixtapeSource",
  initialState: initialMixtapeSourceState,
  reducers: {
    setMixtapeSource: (
      state: MixtapeSourceState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtapeSource } = mixtapeSourceSlice.actions;

export default mixtapeSourceSlice.reducer;
