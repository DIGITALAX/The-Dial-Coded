import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeleteTrackState {
  value?: string;
}

const initialDeleteTrackState: DeleteTrackState = {
  value: undefined,
};

export const deleteTrackSlice = createSlice({
  name: "deleteTrack",
  initialState: initialDeleteTrackState,
  reducers: {
    setDeleteTrack: (
      state: DeleteTrackState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDeleteTrack } = deleteTrackSlice.actions;

export default deleteTrackSlice.reducer;
