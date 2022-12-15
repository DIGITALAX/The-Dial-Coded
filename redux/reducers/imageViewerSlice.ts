import { createSlice } from "@reduxjs/toolkit";

export interface ImageViewerState {
  open?: boolean;
  image: string;
}

const initialImageViewerState: ImageViewerState = {
  open: false,
  image: "",
};

export const imageViewerSlice = createSlice({
  name: "imageViewer",
  initialState: initialImageViewerState,
  reducers: {
    setImageViewer: (
      state: ImageViewerState,
      { payload: { actionOpen, actionImage } }
    ) => {
      state.open = actionOpen;
      state.image = actionImage;
    },
  },
});

export const { setImageViewer } = imageViewerSlice.actions;

export default imageViewerSlice.reducer;
