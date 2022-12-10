import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedOrderState {
  value?: string;
}

const initialFeedOrderState: FeedOrderState = {
  value: "chrono",
};

export const feedOrderSlice = createSlice({
  name: "feedOrder",
  initialState: initialFeedOrderState,
  reducers: {
    setFeedOrder: (state: FeedOrderState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedOrder } = feedOrderSlice.actions;

export default feedOrderSlice.reducer;
