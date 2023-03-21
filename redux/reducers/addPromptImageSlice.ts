import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AddPromptImageState {
  url?: any;
  local: boolean;
  batch?: any[];
}

const initialAddPromptImageState: AddPromptImageState = {
  url: undefined,
  local: false,
};

export const addPromptImageSlice = createSlice({
  name: "addPromptImage",
  initialState: initialAddPromptImageState,
  reducers: {
    setAddPromptImage: (
      state: AddPromptImageState,
      { payload: { actionURL, actionLocal, actionBatch } }
    ) => {
      state.url = actionURL;
      state.local = actionLocal;
      state.batch = actionBatch;
    },
  },
});

export const { setAddPromptImage } = addPromptImageSlice.actions;

export default addPromptImageSlice.reducer;
