import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UploadedMedia } from "../../components/Common/types/common.types";

export interface PostImagesState {
  value?: UploadedMedia[];
}

const initialPostImagesState: PostImagesState = {
  value: undefined,
};

export const postImagesSlice = createSlice({
  name: "postImages",
  initialState: initialPostImagesState,
  reducers: {
    setPostImages: (state: PostImagesState, action: PayloadAction<UploadedMedia[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setPostImages } = postImagesSlice.actions;

export default postImagesSlice.reducer;
