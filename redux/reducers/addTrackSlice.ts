import { createSlice } from "@reduxjs/toolkit";

export interface AddTrackState {
  imageURI?: string[];
  title?: string[];
}

const initialAddTrackState: AddTrackState = {
  imageURI: undefined,
  title: undefined,
};

export const addTrackSlice = createSlice({
  name: "addTrack",
  initialState: initialAddTrackState,
  reducers: {
    setAddTrack: (
      state: AddTrackState,
      { payload: { actionImageURI, actionTitle } }
    ) => {
      state.imageURI = actionImageURI;
      state.title = actionTitle;
    },
  },
});

export const { setAddTrack } = addTrackSlice.actions;

export default addTrackSlice.reducer;
