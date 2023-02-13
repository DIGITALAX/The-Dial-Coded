import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AddPromptImageState {
  value?: any;
}

const initialAddPromptImageState: AddPromptImageState = {
  value: undefined,
};

export const addPromptImageSlice = createSlice({
  name: "addPromptImage",
  initialState: initialAddPromptImageState,
  reducers: {
    setAddPromptImage: (
      state: AddPromptImageState,
      action: PayloadAction<any>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAddPromptImage } = addPromptImageSlice.actions;

export default addPromptImageSlice.reducer;
