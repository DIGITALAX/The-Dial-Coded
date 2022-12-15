import { createSlice } from "@reduxjs/toolkit";

export interface AddMixtapeState {
  name?: number;
  source?: string;
  selection?: string;
  tracks?: string[];
}

const initialAddMixtapeState: AddMixtapeState = {
  name: undefined,
  source: undefined,
  selection: undefined,
  tracks: undefined,
};

export const addMixtapeSlice = createSlice({
  name: "addMixtape",
  initialState: initialAddMixtapeState,
  reducers: {
    setAddMixtape: (
      state: AddMixtapeState,
      { payload: { actionName, actionSource, actionSelection, actionTracks } }
    ) => {
      state.name = actionName;
      state.source = actionSource;
      state.selection = actionSelection;
      state.tracks = actionTracks;
    },
  },
});

export const { setAddMixtape } = addMixtapeSlice.actions;

export default addMixtapeSlice.reducer;
