import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapeState {
  value?: any[];
}

const initialMixtapeState: MixtapeState = {
  value: undefined,
};

export const mixtapeSlice = createSlice({
  name: "mixtape",
  initialState: initialMixtapeState,
  reducers: {
    setMixtape: (
      state: MixtapeState,
      action: PayloadAction<any[] | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMixtape } = mixtapeSlice.actions;

export default mixtapeSlice.reducer;
