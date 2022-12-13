import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostImagesState {
  value?: string[];
}

const initialPostImagesState: PostImagesState = {
  value: undefined,
};

export const postImagesSlice = createSlice({
  name: "postImages",
  initialState: initialPostImagesState,
  reducers: {
    setPostImages: (state: PostImagesState, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setPostImages } = postImagesSlice.actions;

export default postImagesSlice.reducer;
