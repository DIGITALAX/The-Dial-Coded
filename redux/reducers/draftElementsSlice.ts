import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DraftElementsState {
  value: any[];
}

const initialDraftElementstState: DraftElementsState = {
  value: [],
};

export const draftelementsSlice = createSlice({
  name: "draftelements",
  initialState: initialDraftElementstState,
  reducers: {
    setDraftElements: (state: DraftElementsState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setDraftElements } = draftelementsSlice.actions;

export default draftelementsSlice.reducer;
