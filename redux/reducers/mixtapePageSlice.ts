import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MixtapePageState {
  value?: string;
}

const initialMixtapePageState: MixtapePageState = {
  value: "mixtape",
};

export const MixtapePageSlice = createSlice({
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

export const { setMixtapePage } = MixtapePageSlice.actions;

export default MixtapePageSlice.reducer;
