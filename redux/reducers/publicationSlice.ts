import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PublicationState {
  value?: boolean;
}

const initialPublicationState: PublicationState = {
  value: false,
};

export const publicationSlice = createSlice({
  name: "publication",
  initialState: initialPublicationState,
  reducers: {
    setPublication: (
      state: PublicationState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPublication } = publicationSlice.actions;

export default publicationSlice.reducer;
