import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DraftTitleState {
  value?: string;
}

const initialDraftTitleState: DraftTitleState = {
  value: "untitled draft",
};

export const draftTitleSlice = createSlice({
  name: "draftTitle",
  initialState: initialDraftTitleState,
  reducers: {
    setDraftTitle: (state: DraftTitleState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setDraftTitle } = draftTitleSlice.actions;

export default draftTitleSlice.reducer;
