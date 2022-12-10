import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedTypeState {
  value?: string;
}

const initialFeedTypeState: FeedTypeState = {
  value: "reflex",
};

export const feedTypeSlice = createSlice({
  name: "feedType",
  initialState: initialFeedTypeState,
  reducers: {
    setFeedType: (state: FeedTypeState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedType } = feedTypeSlice.actions;

export default feedTypeSlice.reducer;
