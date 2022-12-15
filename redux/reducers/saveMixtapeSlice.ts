import { createSlice } from "@reduxjs/toolkit";

export interface SaveMixtapeState {
  name?: number;
  source?: string;
  selection?: string;
  tracks?: string[];
}

const initialSaveMixtapeState: SaveMixtapeState = {
  name: undefined,
  source: undefined,
  selection: undefined,
  tracks: undefined,
};

export const saveMixtapeSlice = createSlice({
  name: "saveMixtape",
  initialState: initialSaveMixtapeState,
  reducers: {
    setSaveMixtape: (
      state: SaveMixtapeState,
      { payload: { actionName, actionSource, actionSelection, actionTracks } }
    ) => {
      state.name = actionName;
      state.source = actionSource;
      state.selection = actionSelection;
      state.tracks = actionTracks;
    },
  },
});

export const { setSaveMixtape } = saveMixtapeSlice.actions;

export default saveMixtapeSlice.reducer;
