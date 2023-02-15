import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitImagePromptState {
  value?: string;
}

const initialInitImagePromptState: InitImagePromptState = {
  value: undefined,
};

export const initImagePromptSlice = createSlice({
  name: "initImagePrompt",
  initialState: initialInitImagePromptState,
  reducers: {
    setInitImagePrompt: (
      state: InitImagePromptState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setInitImagePrompt } = initImagePromptSlice.actions;

export default initImagePromptSlice.reducer;
