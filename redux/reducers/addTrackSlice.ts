import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AddTrackState {
  value?: number;
}

const initialAddTrackState: AddTrackState = {
  value: 0,
};

export const addTrackSlice = createSlice({
  name: "addTrack",
  initialState: initialAddTrackState,
  reducers: {
    setAddTrack: (state: AddTrackState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setAddTrack } = addTrackSlice.actions;

export default addTrackSlice.reducer;
