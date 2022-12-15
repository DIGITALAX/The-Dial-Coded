import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EditTrackState {
  value?: string;
}

const initialEditTrackState: EditTrackState = {
  value: undefined,
};

export const editTrackSlice = createSlice({
  name: "editTrack",
  initialState: initialEditTrackState,
  reducers: {
    setEditTrack: (
      state: EditTrackState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setEditTrack } = editTrackSlice.actions;

export default editTrackSlice.reducer;
