import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CompleteTrackState {
  value?: boolean;
}

const initialCompleteTrackState: CompleteTrackState = {
  value: false,
};

export const completeTrackSlice = createSlice({
  name: "completeTrack",
  initialState: initialCompleteTrackState,
  reducers: {
    setCompleteTrack: (
      state: CompleteTrackState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCompleteTrack } = completeTrackSlice.actions;

export default completeTrackSlice.reducer;
