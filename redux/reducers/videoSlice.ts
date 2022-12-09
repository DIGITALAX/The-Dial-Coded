import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoState {
  value?: boolean;
}

const initialVideoState: VideoState = {
  value: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState: initialVideoState,
  reducers: {
    setVideo: (state: VideoState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setVideo } = videoSlice.actions;

export default videoSlice.reducer;
