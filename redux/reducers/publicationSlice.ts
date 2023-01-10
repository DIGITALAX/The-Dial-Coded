import { createSlice } from "@reduxjs/toolkit";

export interface PublicationState {
  open?: boolean;
  canvas?: boolean;
}

const initialPublicationState: PublicationState = {
  open: false,
  canvas: false,
};

export const publicationSlice = createSlice({
  name: "publication",
  initialState: initialPublicationState,
  reducers: {
    setPublication: (
      state: PublicationState,
      { payload: { actionOpen, actionCanvas } }
    ) => {
      state.open = actionOpen;
      state.canvas = actionCanvas;
    },
  },
});

export const { setPublication } = publicationSlice.actions;

export default publicationSlice.reducer;
