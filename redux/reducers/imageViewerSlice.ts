import { createSlice } from "@reduxjs/toolkit";

export interface ImageViewerState {
  type: string;
  open?: boolean;
  image: string;
}

const initialImageViewerState: ImageViewerState = {
  type: "",
  open: false,
  image: "",
};

export const imageViewerSlice = createSlice({
  name: "imageViewer",
  initialState: initialImageViewerState,
  reducers: {
    setImageViewer: (
      state: ImageViewerState,
      { payload: { actionType, actionOpen, actionImage } }
    ) => {
      state.type = actionType;
      state.open = actionOpen;
      state.image = actionImage;
    },
  },
});

export const { setImageViewer } = imageViewerSlice.actions;

export default imageViewerSlice.reducer;
