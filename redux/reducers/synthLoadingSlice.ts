import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthLoading {
  value: boolean;
}

const initialSynthLoading: SynthLoading = {
  value: false,
};

export const synthLoadingSlice = createSlice({
  name: "synthLoading",
  initialState: initialSynthLoading,
  reducers: {
    setSynthLoading: (state: SynthLoading, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthLoading } = synthLoadingSlice.actions;

export default synthLoadingSlice.reducer;
